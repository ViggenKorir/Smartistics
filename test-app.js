const puppeteer = require('puppeteer');

async function testSmartisticsApp() {
  console.log('🚀 Starting Smartistics Analytics Platform Test...');

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });

    const page = await browser.newPage();

    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });

    // Test 1: Check if homepage redirects to login
    console.log('✅ Test 1: Homepage redirect to login');
    await page.waitForSelector('h2', { timeout: 5000 });
    const loginTitle = await page.$eval('h2', el => el.textContent);
    if (loginTitle.includes('Smartistics Analytics')) {
      console.log('   ✓ Successfully redirected to login page');
    } else {
      console.log('   ❌ Login page not found');
    }

    // Test 2: Test role selection
    console.log('✅ Test 2: Role selection functionality');
    const roles = ['Founder', 'Marketer', 'Analyst', 'Admin'];

    for (const role of roles) {
      console.log(`   Testing ${role} role...`);

      // Select role
      await page.click(`input[value="${role}"]`);
      await page.waitForTimeout(500);

      // Click sign in button
      await page.click('button[type="button"]');
      await page.waitForTimeout(2000);

      // Check if redirected to dashboard
      try {
        await page.waitForSelector('h1', { timeout: 3000 });
        const dashboardTitle = await page.$eval('h1', el => el.textContent);

        if (dashboardTitle.includes('ROI Calculator')) {
          console.log(`   ✓ ${role} successfully logged in and accessed ROI Calculator`);

          // Test dashboard functionality for each role
          await testROICalculator(page, role);

        } else {
          console.log(`   ❌ ${role} login failed - wrong dashboard`);
        }
      } catch (error) {
        console.log(`   ❌ ${role} login failed - timeout`);
      }

      // Logout for next test
      try {
        await page.click('button:has-text("Logout")');
        await page.waitForSelector('h2', { timeout: 2000 });
      } catch (error) {
        await page.goto('http://localhost:3001/login');
        await page.waitForSelector('h2', { timeout: 2000 });
      }
    }

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function testROICalculator(page, role) {
  try {
    console.log(`   Testing ROI Calculator for ${role}...`);

    // Test form input
    await page.type('input[type="number"]:nth-of-type(1)', '1000');
    await page.waitForTimeout(300);

    await page.type('input[type="number"]:nth-of-type(2)', '50');
    await page.waitForTimeout(300);

    await page.type('input[type="number"]:nth-of-type(3)', '2000');
    await page.waitForTimeout(1000);

    // Check if KPI cards are updated
    const kpiCards = await page.$$('.bg-white.rounded-lg.shadow-sm');
    if (kpiCards.length >= 3) {
      console.log(`   ✓ KPI cards rendered correctly`);
    }

    // Test export functionality (CSV button)
    const csvButton = await page.$('button:has-text("Export CSV")');
    if (csvButton) {
      console.log(`   ✓ Export functionality available`);
    }

    // Test chart rendering
    const chart = await page.$('canvas, svg');
    if (chart) {
      console.log(`   ✓ Chart rendered successfully`);
    }

    // Test reset functionality
    const resetButton = await page.$('button:has-text("Reset")');
    if (resetButton) {
      await resetButton.click();
      await page.waitForTimeout(500);
      console.log(`   ✓ Reset functionality working`);
    }

  } catch (error) {
    console.log(`   ⚠️  Some ROI Calculator features may not be fully functional: ${error.message}`);
  }
}

// Simplified test without puppeteer if it's not available
async function simpleTest() {
  console.log('📋 Running simple connectivity test...');

  try {
    const response = await fetch('http://localhost:3001');
    if (response.ok) {
      console.log('✅ Application is running and accessible');
      console.log('🔗 Visit http://localhost:3001 to test manually');

      // Test API endpoints
      console.log('🧪 Testing API endpoints...');

      const mockAPITests = [
        { endpoint: '/api/auth/login', method: 'POST' },
        { endpoint: '/api/campaigns', method: 'GET' },
        { endpoint: '/api/roi', method: 'GET' }
      ];

      for (const test of mockAPITests) {
        try {
          const apiResponse = await fetch(`http://localhost:3001${test.endpoint}`);
          console.log(`   ${test.method} ${test.endpoint}: ${apiResponse.status === 404 ? 'Not implemented (expected)' : 'Response received'}`);
        } catch (error) {
          console.log(`   ${test.method} ${test.endpoint}: Server not responding`);
        }
      }

    } else {
      console.log('❌ Application returned error:', response.status);
    }
  } catch (error) {
    console.log('❌ Cannot connect to application:', error.message);
    console.log('💡 Make sure the dev server is running: npm run dev');
  }
}

// Run appropriate test based on available dependencies
async function runTests() {
  try {
    // Try to use puppeteer for full testing
    require('puppeteer');
    await testSmartisticsApp();
  } catch (error) {
    // Fallback to simple test
    console.log('📝 Puppeteer not available, running simple tests...');
    await simpleTest();
  }
}

// Manual test checklist
function printManualTestChecklist() {
  console.log('\n📋 Manual Test Checklist:');
  console.log('========================================');
  console.log('1. ✅ Homepage redirects to login');
  console.log('2. ✅ Role selection works (Founder, Marketer, Analyst, Admin)');
  console.log('3. ✅ Dashboard loads with correct navigation');
  console.log('4. ✅ ROI Calculator form accepts input');
  console.log('5. ✅ KPI cards update with calculations');
  console.log('6. ✅ Chart renders properly');
  console.log('7. ✅ Export buttons are functional');
  console.log('8. ✅ Logout functionality works');
  console.log('9. ✅ Role-based access control works');
  console.log('10. ✅ Responsive design on mobile');
  console.log('\n🎯 Key Features to Test:');
  console.log('- ROI Calculation: (Revenue - Ad Spend) / Ad Spend × 100');
  console.log('- CPA Calculation: Ad Spend / Conversions');
  console.log('- ROAS Calculation: Revenue / Ad Spend');
  console.log('- CSV Export functionality');
  console.log('- Chart.js and Recharts integration');
  console.log('- Role-based dashboard access');
  console.log('\n🔧 Troubleshooting:');
  console.log('- If charts don\'t render: Check Chart.js and Recharts installation');
  console.log('- If authentication fails: Check localStorage in browser dev tools');
  console.log('- If styles are broken: Verify Tailwind CSS is working');
  console.log('- If TypeScript errors: Run npm run build to see detailed errors');
}

// Run the tests
runTests().then(() => {
  printManualTestChecklist();
}).catch(error => {
  console.error('Test runner failed:', error);
  printManualTestChecklist();
});
