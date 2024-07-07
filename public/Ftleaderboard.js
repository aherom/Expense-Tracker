const Leaderboard = document.getElementById('Leaderboard');

Leaderboard.onclick = async () => {
  try {
    const response = await axios.get('/Premium/Leaderboard', {
      headers: { "Authorization": `${token}` }
    });

    const data = response.data;
    
    const leaderboardContainer = document.createElement('div');
    
    const heading = document.createElement('h1');
    heading.textContent = 'Leaderboard';
    leaderboardContainer.appendChild(heading);

    const ul = document.createElement('ul');
  
    data.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `Name:${entry.name} / Total Expense:${entry.totalExpense}`;
      ul.appendChild(li);
    });
  
    leaderboardContainer.appendChild(ul);
    
    const displayElement = document.getElementById('leaderboardDisplay');
    
    if (displayElement) {
      displayElement.innerHTML = ''; 
      displayElement.appendChild(leaderboardContainer);
    } else {
      console.error('Element with id "leaderboardDisplay" not found.');
    }
  } catch (error) {
    console.error(error);
  }
}
