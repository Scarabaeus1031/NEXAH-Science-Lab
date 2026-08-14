# Early-Warning Core / Data Disposition Record

Status date: 2026-08-14

Disposition: **LOCAL_ARTIFACT_BUILT; REMOTE STORAGE NOT SELECTED**

Scientific status: **LEVEL1C_COMPLETE_INCONCLUSIVE**

Recommended scientific route: `NEW_PROTOCOL_REQUIRED_FOR_IDENTIFIABILITY`

## Frozen split

- Complete source package: **3,042 files**, **2.6 GiB**, tree `5f4e0014714a39d807a5f3849bfbeab23c7db9c2d1196ee2105a0a777ed7cc64`
- Git reproducibility core: **52 files**, **5.5 MiB**, tree `84f2c3089c16f91324c15ed9d82bacbff919f9d2347411edb7e321c327b97253`
- External raw-data body: **2,990 files**, **2.6 GiB**, tree `b3254f3c74f2a37359a0213d47baf8ddc599b8165263552d845562b847095efb`
- External prefixes: `level1/raw/`, `level1c/raw/`

## Local immutable artifact

- Filename: `NEXAH_EARLY_WARNING_LEVEL1C_RAW_V1.tar.zst`
- Compressed size: **950.5 MiB**
- Archive SHA-256: `c1fefaba8dff625705c0e858208d12260574e08f232a026e1cd20cfc0ad30925`
- Stream verification: **PASS**
- Deterministic rebuild: **PASS**
- Remote URI: **not assigned**

## Verification and authority boundary

- Every core and data file is recorded by relative path, byte size and SHA-256.
- Archive verification streams every member and compares its size and SHA-256 to the manifest.
- No research source, result or generated trajectory was modified.
- This repository record does not authorize upload or deletion.
- A local copy remains necessary until a private durable upload and clean retrieval have both passed.

## Next owner gate

`SELECT_PRIVATE_DURABLE_OBJECT_STORAGE_AND_AUTHORIZE_UPLOAD`
