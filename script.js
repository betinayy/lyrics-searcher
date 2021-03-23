let form = document.getElementById("form");
let search = document.getElementById("search");
let result = document.getElementById("result");

const apiURL = 'https://api.lyrics.ovh';

async function searchSong(term) {
    let res = await fetch(`${apiURL}/suggest/${term}`);
    let data = await res.json();

    showData(data);
}

function showData(data) {
    result.innerHTML = `
    <ul>
      ${data.data
        .map(
          song =>` 
            <li>
                <span><strong>${song.artist.name}</strong> - ${song.title}</span>
                <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
            </li>`
        )
        .join('')}
    </ul>
  `;
}

async function getLyrics(artist, song_name) {
    let res = await fetch(`${apiURL}/v1/${artist}/${song_name}`);
    let data = await res.json();

    if (data.error) {
        result.innerHTML = data.error;
    } else {
        let lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
        result.innerHTML = `
            <h3>${artist} - ${song_name}</h3>
            <span>${lyrics}</span>
        `;
    }
}

form.addEventListener('submit', e => {
    e.preventDefault();

    let searchTerm = search.value.trim();

    if (!searchTerm) alert('Add a song name and artist');
    else searchSong(searchTerm);
});

result.addEventListener('click', e => {
    let element = e.target;

    if (element.tagName === 'BUTTON') {
        let artist = element.getAttribute('data-artist');
        let song_name = element.getAttribute('data-songtitle');

        getLyrics(artist, song_name);
    }
});