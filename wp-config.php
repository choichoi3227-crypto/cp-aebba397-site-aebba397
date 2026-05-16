<?php
/**
 * WordPress 기본 설정 파일
 * CloudPress 자동 생성 — 직접 수정하지 마세요
 * 데이터베이스: SQLite (_db/wordpress.db — GitHub 레포 저장)
 */

// ── SQLite 데이터베이스 설정 ──────────────────────────────────────────────────
// D1(Cloudflare) 대신 GitHub 레포 내 SQLite .db 파일 사용
// db.php 드롭인(wp-content/db.php)이 SQLite 연결을 처리합니다.
define( 'DB_NAME',     'aebba397-2565-48a1-b138-54a56c214365_wp' );
define( 'DB_USER',     'cloudpress' );
define( 'DB_PASSWORD', '' );
define( 'DB_HOST',     'localhost' );
define( 'DB_CHARSET',  'utf8mb4' );
define( 'DB_COLLATE',  '' );

// ── SQLite 플러그인 설정 ──────────────────────────────────────────────────────
// wp-content/db.php (SQLite Database Integration 드롭인)
define( 'SQLITE_DB_DIR',  ABSPATH . '_db/' );   // GitHub 레포 내 _db/ 폴더
define( 'SQLITE_DB_FILE', 'wordpress.db' );      // .db 확장자 (D1 금지)

// ── 인증 키 & 솔트 ──────────────────────────────────────────────────────────
define( 'AUTH_KEY',         'taqlwudc4b5vvavw8zdqfaz8jact233qegvaxbeugbja845unwwgxe4vde2kafoj' );
define( 'SECURE_AUTH_KEY',  '9gv1hmu8x6p76x6v4dpvmrhfcgyv7d3nw9atqvp4k9og70lmjtqn1xltoynd29bu' );
define( 'LOGGED_IN_KEY',    '69lxsc2w2qxrszqpu4ffa5bsv1pdff3vz9cqlub57a10y309qbvlc9qxjkkiddhs' );
define( 'NONCE_KEY',        't535tuswrsga645drjw4zv7ix86x99vvnyxxuxizuehxr7qh9208qcilp3g9ljtr' );
define( 'AUTH_SALT',        's87kcwx32w2cyqglkrwodf4b0pgjpufx0cd0s1mqzpi30wzhgtdbd6tm7e0miz3b' );
define( 'SECURE_AUTH_SALT', 'pew4mp0njbu3ofvci9olpd33kcomtfmctvcw8iwj81e3qp2rmz7cxex2skvgqnik' );
define( 'LOGGED_IN_SALT',   'r01xdpccczno5c0dhivmv6gsdv01bt3yljf0bi7bdbs8vpbvjfrjdcmu07cun6d9' );
define( 'NONCE_SALT',       'zud1ul2maww0p9ynvo8herdmex6rai7gipgwox1ukywfy1pok71sc79s2wk1pd9w' );

// ── CloudPress 전용 설정 ─────────────────────────────────────────────────────
define( 'CP_SITE_ID', getenv('CP_SITE_ID') ?: 'aebba397-2565-48a1-b138-54a56c214365' );
define( 'CP_GITHUB_OWNER',  getenv('CP_GITHUB_OWNER')  ?: '' );
define( 'CP_GITHUB_REPO',   getenv('CP_GITHUB_REPO')   ?: '' );
define( 'CP_GITHUB_TOKEN',  getenv('CP_GITHUB_TOKEN')  ?: '' );

// ── 테이블 접두사 ────────────────────────────────────────────────────────────
$table_prefix = 'wp_';

// ── 절대 경로 ───────────────────────────────────────────────────────────────
if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', __DIR__ . '/' );
}

// ── 디버그 설정 ─────────────────────────────────────────────────────────────
define( 'WP_DEBUG',         false );
define( 'WP_DEBUG_LOG',     false );
define( 'WP_DEBUG_DISPLAY', false );

// ── 보안 설정 ───────────────────────────────────────────────────────────────
define( 'DISALLOW_FILE_EDIT', true );

// ── 업로드 경로 ──────────────────────────────────────────────────────────────
define( 'UPLOADS', 'wp-content/uploads' );

// ── WordPress 설정 로드 ──────────────────────────────────────────────────────
require_once ABSPATH . 'wp-settings.php';
