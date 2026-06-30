import { fileURLToPath } from 'node:url';
import { test } from '../src/fixtures/test';

/** Absolute path to the workout-log fixture, resolved relative to this spec. */
const workoutLog = fileURLToPath(new URL('fixtures/workout-log.txt', import.meta.url));

/**
 * Workout Log Upload — file upload at /upload.
 * Uploads a small fixture file and asserts the success confirmation.
 */
test.describe('Workout Log Upload (/upload) @upload', () => {
  test('an athlete uploads a workout log and sees the success confirmation @smoke', async ({
    uploadPage,
  }) => {
    await uploadPage.goto();
    await uploadPage.uploadFile(workoutLog);
    await uploadPage.expectUploadSuccess('workout-log.txt');
  });
});
