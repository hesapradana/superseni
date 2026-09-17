/**
 * The one place that knows which regency this site is about.
 * Coverage rule: any art form, from anywhere, as long as it performs here.
 */
export const TEMANGGUNG_REGENCY_ID = "reg-temanggung"

/**
 * How long a poster with no performance date stays on Explore, counted from
 * upload. Posters usually go round one to two weeks before the night; past
 * that, an undated one is most likely stale. A setting, not a rule of the
 * data — change it freely.
 */
export const EXPLORE_UNDATED_DAYS = 14

/**
 * Upload limits. The poster is shrunk in the browser before it is sent: the
 * long edge is capped so text stays legible full-screen on a phone, and the
 * file must fit under the Server Action body limit (1 MB by default in Next 16,
 * multipart overhead included).
 */
export const UPLOAD_MAX_EDGE_PX = 1600
export const UPLOAD_MAX_BYTES = 950_000
/** Anything bigger than this is refused before the browser even decodes it. */
export const UPLOAD_MAX_SOURCE_BYTES = 25_000_000
export const UPLOAD_MAX_SOURCES = 10
