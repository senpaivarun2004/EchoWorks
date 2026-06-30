# LyricShare - System Requirements

## Prerequisites

The following tools must be installed before setting up LyricShare:

### Core

| Tool       | Version   | Install Command (Windows)              | Purpose                  |
|------------|-----------|----------------------------------------|--------------------------|
| Node.js    | >= 20.x   | `winget install OpenJS.NodeJS`         | Web/mobile/desktop apps  |
| pnpm       | >= 9.x    | `npm install -g pnpm`                  | Package manager          |
| Rust       | >= 1.78   | `winget install Rustlang.Rustup`       | API server + WASM core   |
| PostgreSQL | >= 16     | `winget install PostgreSQL.PostgreSQL` | Database                 |

### Optional

| Tool      | Version | Install Command                              | Purpose                |
|-----------|---------|----------------------------------------------|------------------------|
| ffmpeg    | latest  | `winget install ffmpeg`                      | Video export           |
| MinIO     | latest  | `winget install MinIO.MinIO`                 | Local S3-compatible storage |
| wasm-pack | latest  | `cargo install wasm-pack`                    | Build WASM core        |
| Expo CLI  | latest  | `npm install -g expo-cli`                    | Mobile development     |
| Tauri CLI | latest  | `cargo install tauri-cli`                    | Desktop development    |

## One-Time Setup

### 1. Install PostgreSQL

```bash
winget install PostgreSQL.PostgreSQL
```

During installation, note the **port** (default: 5432) and **password** you set for the `postgres` user.

### 2. Create the Database

Open **SQL Shell (psql)** or any PostgreSQL client and run:

```sql
CREATE DATABASE lyricshare;
```

Or via command line:

```bash
psql -U postgres -c "CREATE DATABASE lyricshare;"
```

### 3. Configure Environment

Copy the example env file and update the database URL:

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/lyricshare
```

### 4. Run Migrations

```bash
cd apps/api && cargo run
```

The API server automatically runs migrations on startup.

## Verifying Installation

```bash
# Check Node.js
node --version     # → v20.x.x

# Check pnpm
pnpm --version     # → 9.x.x

# Check Rust
rustc --version    # → rustc 1.78.x

# Check PostgreSQL
psql --version     # → psql 16.x

# Check database connection
psql -U postgres -d lyricshare -c "\dt"
```

## Troubleshooting

### "role 'postgres' does not exist"

Run `createuser -s postgres` as admin, or use a different user.

### "Connection refused"

Make sure the PostgreSQL service is running:

```bash
net start postgresql-x64-16
```

### Port conflicts

If PostgreSQL is on a different port, update `DATABASE_URL` accordingly:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5433/lyricshare
```
