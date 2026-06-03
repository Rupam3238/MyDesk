import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n✅ MYDESK Server running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET    /health`);
  console.log(`  POST   /api/sessions`);
  console.log(`  GET    /api/sessions`);
  console.log(`  GET    /api/sessions/today`);
  console.log(`  GET    /api/sessions/:id`);
  console.log(`  PUT    /api/sessions/:id`);
  console.log(`  POST   /api/sessions/:id/complete`);
  console.log(`  DELETE /api/sessions/:id`);
  console.log(`  GET    /api/sessions/stats/:period`);
  console.log(`\n  POST   /api/notes`);
  console.log(`  GET    /api/notes`);
  console.log(`  GET    /api/notes/today`);
  console.log(`  GET    /api/notes/:id`);
  console.log(`  PUT    /api/notes/:id`);
  console.log(`  DELETE /api/notes/:id`);
  console.log(`\n  POST   /api/habits`);
  console.log(`  GET    /api/habits`);
  console.log(`  GET    /api/habits/today/status`);
  console.log(`  GET    /api/habits/:id`);
  console.log(`  GET    /api/habits/:id/completions`);
  console.log(`  PUT    /api/habits/:id`);
  console.log(`  POST   /api/habits/:id/complete`);
  console.log(`  DELETE /api/habits/:id`);
  console.log('\n');
});
