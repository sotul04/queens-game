# Queens Game Solver
Queens Game adalah salah satu permainan yang disediakan LinkedIn untuk penggunanya. Permainan ini memiliki objektif untuk mengalokasikan sebuah "Queen" pada setiap area warna dengan aturan-aturan tertentu. Aturan dasarnya adalah tidak ada "Queen" yang berada pada area warna, kolom, dan baris yang sama dan tidak ada "Queen" yang berada pada daerah blok terdekat disekelilingnya. Selain itu, pada project ini juga disediakan model Chess Piece.  

### Author: Suthasoma Mahardhika Munthe 13522098

### Tech Stack
- Frontend:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - ShadCN UI

- Backend:
  - Golang

- Development Tools:
  - ESLint
  - Prettier

### Program Structure
```
.
├── backend
│   ├── model
│   ├── solver                  # Solver Algorithm Implementation
│   ├── main.go                 # Backend Listener
├── public
├── src
│   ├── app                     # Page
│   ├── components              # UI Components
│   │   ├── model               # Board Components
│   │   └── ui                  # Additional Components
│   └── lib                     # utils 
└── ...
```

### Queens Game Solver Algorithm
Algoritma yang digunakan adalah algoritma Backtracking. Algoritma Backtracking merupakan algoritma yang mencoba membangung solusi secara bertahap dengan basis DFS. Namun, pada algoritma backtracking jika pada suatu tahap tertentu dapat ditentukan jika langkah tersebut tidak mengarah pada solusi yang diinginkan maka proses pencarian akan dihentikan dan dilanjutkan ke langkah lain pada tahap sebelumnya. Proses pemeriksaan ini dilakukan menggunakan bounding function.

Pada kasus Queens Game, setiap area warna akan diekstrak terlebih dahulu. Selanjutnya akan dilakukan proses penempatan piece pada setiap area secara bertahap dari area pertama hingga area terakhir secara DFS. Bounding function yang digunakan melakukan proses pemeriksaan terhadap pelanggaran yang muncul untuk menempatkan setiap piece pada area pada setiap tahap. Jika ada pelanggaran maka proses pemeriksaan pada langkah tersebut (cabang langkah) dihentikan dan dilanjutkan pada langkah lain pada tahap sebelumnya.

Alasan penggunaan algoritma ini karena persoalan ini bukan persoalan optimalitas sehingga algoritma lain seperti dynamic programming atau greedy tidak cocok pada persoalan ini. Selain itu, algoritma backtraking ini tidak memiliki kompleksitas memori yang besar karena berbasis DFS dengan ditambah kemampuan pruning menggunakan bounding function.

### How to Run
> Pastikan Anda sudah menginstall Node.JS, npm dan go.

Silahkan clone repo ini menggunakan command di bawah ini atau dengan mengunduh file project ini.
```
git clone https://github.com/sotul04/queens-game.git
```
Setelah Anda mendownload project ini lakukan instalasi node modules
```
npm install
```
Selanjutnya, jalankan Front-End pada mode development dengan command ini
```
npm run dev
```
Jangan lupa untuk menjalankan Back-End. Kode backend ada pada folder ```backend```. Oleh karena itu, pindah dahulu ke folder tersebut dengan command ```cd backend``` kemudian jalankan command ini
```
go run main.go
```
Jika ada pop up firewall, pilih allow untuk menjalankan server.

### Implemented Bonus
- Board Customization
- Chess Piece 🤌🙏

### Referensi
- Algoritma Backtracking dipelajari dari [modul ini](https://informatika.stei.itb.ac.id/~rinaldi.munir/Stmik/2020-2021/Algoritma-backtracking-2021-Bagian1.pdf). 
