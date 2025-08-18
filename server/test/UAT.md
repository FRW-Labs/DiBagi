# UAT (User Acceptance Testing)

### Modul: Authentication (`/auth`)
| ID | Skenario Pengujian | Endpoint | Pre-kondisi | Hasil yang Diharapkan | Status |
| :--- | :--- | :--- | :--- | :--- |:-------|
| **AUTH-01** | Pengguna baru berhasil mendaftar. | `POST /auth/register` | Data pengguna (username & email) belum ada di database. | **201 Created** & data pengguna baru (tanpa password). | PASSED |
| **AUTH-02** | Pengguna yang sudah ada mencoba mendaftar lagi. | `POST /auth/register` | Username atau email sudah terdaftar. | **409 Conflict** & pesan error yang jelas. | PASSED |
| **AUTH-03** | Pengguna berhasil login dengan kredensial yang valid. | `POST /auth/login` | Pengguna sudah terdaftar & password benar. | **200 OK** & menerima `accessToken` dan `refreshToken`. | PASSED |
| **AUTH-04** | Pengguna gagal login dengan password yang salah. | `POST /auth/login` | Pengguna sudah terdaftar & password salah. | **401 Unauthorized** & pesan error generik. | PASSED |
| **AUTH-05** | Mendapatkan `accessToken` baru menggunakan `refreshToken`. | `POST /auth/refresh` | Pengguna memiliki `refreshToken` yang valid. | **200 OK** & menerima `accessToken` baru. | PASSED |
| **AUTH-06** | Pengguna berhasil logout. | `POST /auth/logout` | Pengguna login dan memiliki `accessToken` yang valid. | **200 OK** & pesan sukses. Refresh token di DB menjadi `null`. | PASSED |

### Modul: User (`/users`)
| ID | Skenario Pengujian | Endpoint | Pre-kondisi | Hasil yang Diharapkan | Status |
| :--- | :--- | :--- | :--- | :--- |:-------|
| **USER-01** | Mencari pengguna berdasarkan username. | `GET /users/search?username=...` | Pengguna login & pengguna yang dicari ada. | **200 OK** & data pengguna yang ditemukan. | PASSED |
| **USER-02** | Mendapatkan profil pengguna berdasarkan ID. | `GET /users/:id` | Pengguna login & ID pengguna valid. | **200 OK** & data pengguna yang sesuai. | PASSED |

### Modul: Group (`/group`)
| ID | Skenario Pengujian | Endpoint | Pre-kondisi | Hasil yang Diharapkan | Status     |
| :--- | :--- | :--- | :--- | :--- |:-----------|
| **GRP-01** | Pengguna yang login berhasil membuat grup baru. | `POST /group/create` | Pengguna login. | **201 Created** & data grup baru. Pembuat otomatis jadi anggota. | PASSED     |
| **GRP-02** | Mendapatkan semua grup di mana pengguna terdaftar. | `GET /group` | Pengguna login dan sudah menjadi anggota beberapa grup. | **200 OK** & array berisi data grup. | PASSED     |
| **GRP-03** | Mendapatkan detail grup spesifik berdasarkan ID. | `GET /group/:id` | Pengguna login & merupakan anggota grup tersebut. | **200 OK** & data grup yang lengkap. | PASSED     |
| **GRP-04** | Pembuat grup berhasil mengundang pengguna lain. | `POST /group/:groupId/invite` | Pengguna adalah pembuat grup, user yang diundang ada & belum jadi anggota. | **200 OK** atau **201 Created** & pesan sukses/data grup terupdate. | PASSED     |
| **GRP-05** | Pengguna non-pembuat mencoba mengundang anggota (gagal). | `POST /group/:groupId/invite` | Pengguna login tapi bukan pembuat grup. | **403 Forbidden** atau **401 Unauthorized**. | PASSED     |
| **GRP-06** | Pembuat grup berhasil mengubah nama/deskripsi grup. | `PUT /group/:groupId/update` | Pengguna adalah pembuat grup. | **200 OK** & data grup yang sudah terupdate. | PASSED     |
| **GRP-07** | Pembuat grup berhasil menghapus anggota lain. | `PUT /group/:groupId/remove-member/:userId` | Pengguna adalah pembuat grup, anggota yang dihapus ada di grup. | **200 OK** & pesan sukses. | PASSED     |
| **GRP-08** | Pembuat grup mencoba menghapus dirinya sendiri (gagal). | `PUT /group/:groupId/remove-member/:userId` | `userId` sama dengan ID pembuat grup. | **400 Bad Request** & pesan error yang jelas. | **FAILED** |
| **GRP-09** | Pembuat grup berhasil menghapus grup. | `DELETE /group/:groupId/delete` | Pengguna adalah pembuat grup. | **200 OK** atau **204 No Content** & pesan sukses. | PASSED     |