use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};

use serde::Serialize;
use tauri::AppHandle;

// ── Event payload ─────────────────────────────────────────────────────────────

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct DownloadProgress {
    id: String,
    /// 0.0 – 100.0
    progress: f64,
    speed: String,
    eta: String,
    /// "queued" | "downloading" | "complete" | "error"
    status: String,
    file_size: String,
    /// Set once yt-dlp prints the destination filename
    title: Option<String>,
}

// ── yt-dlp stdout parser ───────────────────────────────────────────────────────

/// Returns `(percent, file_size, speed, eta)` from a yt-dlp progress line such as:
///   [download]  45.6% of ~123.45MiB at 1.23MiB/s ETA 00:30
///   [download] 100% of 123.45MiB in 00:45 at 2.50MiB/s
fn parse_progress(line: &str) -> Option<(f64, String, String, String)> {
    if !line.contains("[download]") || !line.contains('%') {
        return None;
    }

    // Extract percentage
    let pct_idx = line.find('%')?;
    let before = &line[..pct_idx];
    let pct_start = before.rfind(|c: char| c.is_whitespace()).map(|i| i + 1).unwrap_or(0);
    let pct: f64 = before[pct_start..].trim().parse().ok()?;

    let after = &line[pct_idx + 1..];

    // File size: "of ~123.45MiB"
    let file_size = after
        .find(" of ")
        .map(|i| {
            let s = after[i + 4..].trim_start_matches('~');
            let end = s.find(char::is_whitespace).unwrap_or(s.len());
            s[..end].to_string()
        })
        .unwrap_or_default();

    // Speed: "at X.XXMiB/s"
    let speed = after
        .find(" at ")
        .map(|i| {
            let s = &after[i + 4..];
            let end = s.find(char::is_whitespace).unwrap_or(s.len());
            s[..end].to_string()
        })
        .unwrap_or_default();

    // ETA: "ETA MM:SS"
    let eta = after
        .find("ETA ")
        .map(|i| {
            let s = after[i + 4..].trim();
            let end = s.find(char::is_whitespace).unwrap_or(s.len());
            s[..end].to_string()
        })
        .unwrap_or_default();

    Some((pct, file_size, speed, eta))
}

/// Extracts a human-readable title from a "Destination:" line.
fn parse_destination_title(line: &str) -> Option<String> {
    let prefix = "[download] Destination:";
    if !line.contains(prefix) {
        return None;
    }
    let path_str = line[line.find(prefix)? + prefix.len()..].trim();
    std::path::Path::new(path_str)
        .file_stem()
        .and_then(|s| s.to_str())
        .map(|s| s.to_string())
}

// ── Tauri command ─────────────────────────────────────────────────────────────

#[tauri::command]
fn start_download(
    app: AppHandle,
    id: String,
    url: String,
    format: String,
    quality: String,
    output_dir: String,
    subtitles: bool,
    metadata: bool,
) {
    std::thread::spawn(move || {
        // Expand leading ~
        let dir = if output_dir.starts_with("~/") {
            let home = std::env::var("HOME").unwrap_or_default();
            output_dir.replacen('~', &home, 1)
        } else {
            output_dir
        };

        let mut args: Vec<String> = vec![
            "--newline".into(),
            "--progress".into(),
            "--no-playlist".into(),
        ];

        // Format / quality
        let fmt_lower = format.to_lowercase();
        match fmt_lower.as_str() {
            "mp3" | "wav" => {
                args.push("--extract-audio".into());
                args.push("--audio-format".into());
                args.push(fmt_lower.clone());
            }
            _ => {
                let height_filter = match quality.as_str() {
                    "1080p" => "[height<=1080]",
                    "720p"  => "[height<=720]",
                    "480p"  => "[height<=480]",
                    _       => "",
                };
                args.push("-f".into());
                args.push(format!(
                    "bestvideo{height_filter}+bestaudio/best{height_filter}/best"
                ));
                args.push("--merge-output-format".into());
                args.push(fmt_lower.clone());
            }
        }

        if subtitles {
            args.push("--write-subs".into());
            args.push("--sub-langs".into());
            args.push("all".into());
        }

        if metadata {
            args.push("--embed-metadata".into());
        }

        args.push("-o".into());
        args.push(format!("{dir}/%(title)s.%(ext)s"));
        args.push(url);

        // Emit initial "downloading" state
        let _ = app.emit(
            "download-progress",
            DownloadProgress {
                id: id.clone(),
                progress: 0.0,
                speed: String::new(),
                eta: String::new(),
                status: "downloading".into(),
                file_size: String::new(),
                title: None,
            },
        );

        let mut child = match Command::new("yt-dlp")
            .args(&args)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
        {
            Ok(c) => c,
            Err(_) => {
                let _ = app.emit(
                    "download-progress",
                    DownloadProgress {
                        id,
                        progress: 0.0,
                        speed: String::new(),
                        eta: String::new(),
                        status: "error".into(),
                        file_size: String::new(),
                        title: Some("yt-dlp not found — install it and try again".into()),
                    },
                );
                return;
            }
        };

        if let Some(stdout) = child.stdout.take() {
            let reader = BufReader::new(stdout);
            let mut last_file_size = String::new();

            for line in reader.lines().map_while(Result::ok) {
                // Title from destination line
                if let Some(title) = parse_destination_title(&line) {
                    let _ = app.emit(
                        "download-progress",
                        DownloadProgress {
                            id: id.clone(),
                            progress: 0.0,
                            speed: String::new(),
                            eta: String::new(),
                            status: "downloading".into(),
                            file_size: String::new(),
                            title: Some(title),
                        },
                    );
                    continue;
                }

                // Progress line
                if let Some((pct, file_size, speed, eta)) = parse_progress(&line) {
                    if !file_size.is_empty() {
                        last_file_size = file_size.clone();
                    }
                    let status = if pct >= 100.0 { "complete" } else { "downloading" };
                    let _ = app.emit(
                        "download-progress",
                        DownloadProgress {
                            id: id.clone(),
                            progress: pct,
                            speed,
                            eta,
                            status: status.into(),
                            file_size: if file_size.is_empty() {
                                last_file_size.clone()
                            } else {
                                file_size
                            },
                            title: None,
                        },
                    );
                }
            }
        }

        let exit = child.wait().ok();
        let success = exit.map(|s| s.success()).unwrap_or(false);

        // Final status — only emit error if yt-dlp exited non-zero and we
        // never reached 100 % above.
        if !success {
            let _ = app.emit(
                "download-progress",
                DownloadProgress {
                    id,
                    progress: 0.0,
                    speed: String::new(),
                    eta: String::new(),
                    status: "error".into(),
                    file_size: String::new(),
                    title: None,
                },
            );
        }
    });
}

// ── App entry point ───────────────────────────────────────────────────────────

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![start_download])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
