# Level-1B Freeze Record

Date: 2026-08-13 (Europe/Berlin)  
Disposition: `NOT_ADOPTED`  
Evaluator spec: `NEXAH-EARLY-WARNING-LEVEL1B-EVALUATOR` V1.0.0  
Evaluator spec SHA-256: `2a3a53da5841154f60b07b97b489ac9bdc89df79de65e33b5cb9b36cb0b59839`

## Controlling identities

- original Level-1 manifest: `d742ddfe23cea1ddd94817f51b0abc6b95c33599a78e965e7d375ec33f4fd9f3`;
- human amendment V1.0.1: `ffc7233a15be76580a3518d1ca179b57a96aa2c0a7f6d7b1bde797c5b2249bcc`;
- machine amendment V1.0.1: `c5df438954b3f32d44a4eea6d4add89bb9f10c71e3b32ba8ce135d8b473c870a`;
- evaluator source: `529a9615ef46434b67349981accad223ea906f1f5c0d5bf031eb2fb4e5c63a4e`;
- verifier source: `7e3960e44e56308af8c419e46e3a4bb50dbb5cd0eabbafca1f47cc12b55bdcde`.

The evaluator source and specification are frozen before any evaluation use.
Any byte change invalidates Level-1C authorization until a new prospective
freeze and verification are completed.

## Exact amended semantics

- detection onset: first qualifying state of a subsequently confirmed run;
- confirmation: final required state (10th for primary warning/alarm, 21st for
  primary event);
- event: strict separation `>pi`, 20 complete intervals/21 states at `dt=.01`;
- primary warning/alarm: 10 states, not reinterpreted as continuous duration;
- sensitivity warning/alarm: 18 intervals/19 states; event 40 intervals/41 states;
- final threshold tie: lower R, higher V;
- bootstrap: paired path-stratified, replacement within stratum, original
  stratum size, 10,000 PCG64 seed-1031 replicates, 0.025/0.975 percentile with
  NumPy `method="linear"`, undefined replicates preserved;
- undefined values are never converted to 0 or 1.

## Firewalls

No Level-1 file or raw simulator was modified. No evaluation trajectory was
generated, opened, summarized, hashed for performance, or inspected. No
Application 001 or canonical component changed. No Git operation or deployment
was performed.
