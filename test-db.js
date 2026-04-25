async function main() {
  const loginRes = await fetch('http://localhost:8081/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: 'admin@example.com', password: 'password'})
  });
  if (!loginRes.ok) { console.log('Login failed', loginRes.status); return; }
  const loginData = await loginRes.json();
  const token = loginData.token;
  
  const resRes = await fetch('http://localhost:8081/api/resources', {
    headers: {'Authorization': 'Bearer ' + token}
  });
  if (!resRes.ok) { console.log('Fetch failed', resRes.status); return; }
  const resources = await resRes.json();
  console.log(resources.map(r => ({id: r.id, name: r.name, imageUrl: r.imageUrl})));
}
main();
