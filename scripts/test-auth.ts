async function testAuth() {
  console.log('--- TEST 1: Access /admin/hero without cookie (should redirect to login) ---');
  const res1 = await fetch('http://localhost:3000/admin/hero', { redirect: 'manual' });
  console.log('Status:', res1.status, 'Location header:', res1.headers.get('location'));

  console.log('\n--- TEST 2: Attempt login with wrong password ---');
  const res2 = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@mightywarner.com', password: 'wrongpassword' }),
  });
  const data2 = await res2.json();
  console.log('Status:', res2.status, 'Body:', data2);

  console.log('\n--- TEST 3: Login with correct Super Admin credentials ---');
  const res3 = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@mightywarner.com', password: 'AdminPassword2026!' }),
  });
  console.log('Status:', res3.status);
  const cookie = res3.headers.get('set-cookie');
  console.log('Auth cookie received:', !!cookie);
  const data3 = await res3.json();
  console.log('User profile:', data3.user);

  if (cookie) {
    const rawCookie = cookie.split(';')[0];

    console.log('\n--- TEST 4: Verify session with /api/auth/me ---');
    const res4 = await fetch('http://localhost:3000/api/auth/me', {
      headers: { Cookie: rawCookie },
    });
    console.log('Status:', res4.status, 'Body:', await res4.json());

    console.log('\n--- TEST 5: Access /admin/hero WITH valid cookie ---');
    const res5 = await fetch('http://localhost:3000/admin/hero', {
      headers: { Cookie: rawCookie },
      redirect: 'manual',
    });
    console.log('Status:', res5.status, '(200 means access allowed)');

    console.log('\n--- TEST 6: Access removed /admin/profile route (should redirect to /admin/hero) ---');
    const resProfile = await fetch('http://localhost:3000/admin/profile', {
      headers: { Cookie: rawCookie },
      redirect: 'manual',
    });
    console.log('Status:', resProfile.status, 'Location:', resProfile.headers.get('location'));
  }

  console.log('\n--- TEST 7: Logout ---');
  const res6 = await fetch('http://localhost:3000/api/auth/logout', { method: 'POST' });
  console.log('Status:', res6.status, 'Clear-Cookie:', res6.headers.get('set-cookie'));

  console.log('\n✅ All authentication tests completed successfully!');
}

testAuth().catch(console.error);
