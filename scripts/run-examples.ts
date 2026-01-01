import { glob } from 'tinyglobby';
import { execSync } from 'child_process';

async function runExamples() {
  console.log('Building package...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\nRunning all examples...\n');

  const files = await glob(['examples/*.ts']);
  for (const file of files.sort()) {
    console.log(`▶ Running ${file}`);
    execSync(`npx tsx "${file}"`, { stdio: 'inherit' });
    console.log('');
  }

  console.log('✓ All examples completed successfully!');
}

runExamples().catch(err => {
  console.error('Error running examples:', err);
  process.exit(1);
});
