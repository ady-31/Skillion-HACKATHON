🦺 SafetySnap — Smart PPE Detection & Analytics

SafetySnap is an AI-powered safety monitoring platform that detects Personal Protective Equipment (PPE) like helmets and safety vests from uploaded images. It provides an intuitive dashboard for uploads, analytics, and inspection history — ensuring workplace safety through intelligent visual analysis.

🚀 Features
📸 Image Upload & Detection – Upload images to automatically detect PPE (helmet/vest).

🧠 AI-Powered PPE Analysis – Bounding boxes with normalized coordinates (0–1).

🗂 History & Filtering – View and filter past detections by label, date, or ID.

📊 Analytics Dashboard – Visual insights into PPE compliance trends.

🔐 Duplicate & Hash Handling – Identical uploads return existing IDs via detections_hash.

⚙️ RESTful API Support – Full backend with endpoints for image management and filtering.

🚫 Rate Limiting & Validation – Ensures fair use and API robustness.

📑 API Endpoints Method Endpoint Description POST /api/images Upload image (multipart), detect PPE GET /api/images Fetch history with filters: limit, offset, label, from, to GET /api/images/:id Get specific detection result DELETE /api/images/:id Delete uploaded image entry GET /api/labels List available detection labels 💻 Pages

/upload – Upload new image for PPE detection

/history – Browse and filter detection history

/result/:id – View specific image with bounding boxes

/analytics – PPE usage and detection analytics

🧩 Tech Stack

Frontend: React / Next.js

Backend: Node.js + Express

Storage: Cloud / Local FS

AI Model: PPE Object Detection (Helmet, Vest)

Database: MongoDB / PostgreSQL




