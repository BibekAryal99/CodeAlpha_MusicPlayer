// Music Player JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeControl = document.getElementById('volume');
    const titleEl = document.getElementById('title');
    const artistEl = document.getElementById('artist');
    const cover = document.getElementById('cover');
    const playlistEl = document.getElementById('playlist-songs');

    // Sample playlist - in a real app, these would be actual audio files
    const playlist = [
        {
            title: "Tum Ho Toh ",
            artist: "Arijit Singh",
            src: "Tum Ho Toh Saiyaara Ahaan Panday Aneet Padda_320(PagaiWorld.com).mp3",
            cover: "tum-hai-toh.jpg"
        },
        {
            title: "Shree Ganeshay Dheemahi",
            artist: "Shankar Mahadevan & Lata Mangeshkar",
            src: "Shree Ganeshay Dheemahi.mp3",
            cover: "ganesh.jpg"
        },
        {
            title: "O Rangrez",
            artist: "Javed Bashir & Shreya Ghoshal",
            src: "O Rangrez-320kbps.mp3",
            cover: "O-Rangrez-lyrics.jpg"
        },
        {
            title: "Eyes Closed",
            artist: "Jisoo & Zayn",
            src: "Eyes_Closed.mp3",
            cover: "Jisoo-Zayn-eyes-closed-tgj--scaled.jpg"
        },
        {
            title: "Let me",
            artist: "Zayn",
            src: "ZAYN - Let Me (Official Video) [J-dv_DcDD_A].mp3",
            cover: "let me.jpg"
        }
    ];

    let currentSongIndex = 0;
    let isPlaying = false;

    // Initialize the player
    function initPlayer() {
        loadSong(currentSongIndex);
        updatePlaylistUI();
        setupEventListeners();
    }

    // Load a song
    function loadSong(index) {
        const song = playlist[index];
        audio.src = song.src;
        titleEl.textContent = song.title;
        artistEl.textContent = song.artist;
        cover.src = song.cover;

        // Update active song in playlist
        updatePlaylistUI();
    }

    // Update playlist UI to show active song
    function updatePlaylistUI() {
        playlistEl.innerHTML = '';

        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = `${song.title} - ${song.artist}`;
            if (index === currentSongIndex) {
                li.classList.add('active');
            }
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            });
            playlistEl.appendChild(li);
        });
    }

    // Play song
    function playSong() {
        isPlaying = true;
        audio.play().catch(e => {
            console.error("Error playing audio:", e);
            alert("Could not play audio. This may be due to browser autoplay restrictions. Please try clicking the play button again or allow autoplay for this site.");
        });
        playBtn.innerHTML = '<i class="fas fa-pause">⏸</i>';
    }

    // Pause song
    function pauseSong() {
        isPlaying = false;
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play">▶</i>';
    }

    // Previous song
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = playlist.length - 1;
        }
        loadSong(currentSongIndex);
        playSong();
    }

    // Next song
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex > playlist.length - 1) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        playSong();
    }

    // Update progress bar
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.value = progressPercent;

        // Update time display
        currentTimeEl.textContent = formatTime(currentTime);
    }

    // Set progress
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;

        audio.currentTime = (clickX / width) * duration;
    }

    // Format time in MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Update duration when metadata is loaded
    function updateDuration() {
        durationEl.textContent = formatTime(audio.duration || 0);
        progress.max = audio.duration || 100;
    }

    // Set volume
    function setVolume() {
        audio.volume = volumeControl.value;
    }

    // Event Listeners
    function setupEventListeners() {
        // Play/Pause button
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                pauseSong();
            } else {
                playSong();
            }
        });

        // Previous button
        prevBtn.addEventListener('click', prevSong);

        // Next button
        nextBtn.addEventListener('click', nextSong);

        // Time/song update
        audio.addEventListener('timeupdate', updateProgress);

        // Song ends - go to next song (autoplay)
        audio.addEventListener('ended', nextSong);

        // Click on progress bar to seek
        progress.addEventListener('change', function () {
            audio.currentTime = (this.value / 100) * audio.duration;
        });

        // Update duration when loaded
        audio.addEventListener('loadedmetadata', updateDuration);

        // Handle audio errors
        audio.addEventListener('error', function () {
            console.error('Error loading audio:', this.error);
            alert('Error loading audio. Please check your connection and try again.');
        });

        // Handle metadata loading errors
        audio.addEventListener('stalled', function () {
            console.warn('Audio loading stalled');
        });

        // Volume control
        volumeControl.addEventListener('input', setVolume);
    }

    // Initialize the player
    initPlayer();
});