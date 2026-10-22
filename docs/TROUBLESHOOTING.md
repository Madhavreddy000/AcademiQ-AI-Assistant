# Troubleshooting Guide & Operational Runbook

This guide covers common development, deployment, and operational issues.

---

## 1. Relational Database (MySQL 8) Issues

### Problem: `Communications link failure / Connection refused`
- **Cause**: MySQL service is not running on port 3306 or root credentials differ.
- **Solution**:
  1. Check if MySQL is running:
     ```powershell
     Get-Service *mysql*
     ```
  2. If using Docker Compose:
     ```bash
     docker compose ps mysql
     docker compose logs mysql
     ```
  3. Verify port 3306 is not blocked by Windows Firewall.

### Problem: `Flyway migration checksum mismatch`
- **Cause**: Existing `V1__initial_schema.sql` was modified after being executed on the database.
- **Solution**:
  - Run `mvn flyway:repair` or drop and re-create the database in development:
    ```sql
    DROP DATABASE IF EXISTS academic_ai_db;
    CREATE DATABASE academic_ai_db;
    ```

---

## 2. Vector Database (Qdrant) Issues

### Problem: `Failed to connect to Qdrant at localhost:6334`
- **Cause**: Qdrant container is not running or gRPC port is not exposed.
- **Solution**:
  1. Verify Qdrant is running:
     ```bash
     docker compose up -d qdrant
     ```
  2. Test HTTP health endpoint:
     ```bash
     curl http://localhost:6333/healthz
     ```
  3. Check collection initialization:
     ```bash
     curl http://localhost:6333/collections/university_academic_docs
     ```

---

## 3. Frontend & Vite Development Server Issues

### Problem: `Port 5173 is already in use`
- **Solution**:
  - Run Vite on a custom port or kill existing process:
    ```bash
    npm run dev -- --port 5174
    ```

### Problem: `CORS error on API requests`
- **Cause**: Backend Spring Security CORS configuration does not match the frontend origin.
- **Solution**:
  - The `SecurityConfig.java` allows `allowedOriginPatterns("*")` and supports credentials. Ensure the frontend `vite.config.ts` proxies `/api` to `http://localhost:8080`.

---

## 4. RAG Retrieval Quality & Grounding

### Problem: Chatbot returns "Official Information Notice: Sufficient details not found"
- **Cause**:
  1. The question asks about topics not present in uploaded documents.
  2. The cosine similarity score of the chunks fell below `app.rag.similarity-threshold` (default 0.70).
- **Solution**:
  - Calibrate the similarity threshold in `ProfilePage` or `application.yml`:
    ```yaml
    app:
      rag:
        similarity-threshold: 0.65
        top-k: 6
    ```
  - Verify that the relevant handbook (e.g. `exam_regulations_2026.txt`) has been uploaded and has status `INDEXED`.
