def hitung_split_bill():

    # Harga setelah pajak
    def harga_akhir():
        while True:
            try:
                harga_final = float(input("Masukkan harga akhir: Rp "))
                if harga_final < 0:
                    print("Total tagihan tidak boleh negatif. Coba lagi.")
                    continue
                break
            except ValueError:
                print("Input tidak valid. Harap masukkan angka.")

    def struktur_makanan(): 
        harga_total = 0
        menu_makanan = {}
        count = -1
        # Harga per makanan
        while True:
            count += 1
            nama_makanan = input("Masukkan nama makanan: ")
            try:
                harga_makanan = int(input(f"Masukkan harga untuk {nama_makanan}: "))
                jumlah_makanan = float(input(f"Masukkan jumlah {nama_makanan}: "))
                # Correctly initialize the inner dictionary before assigning values
                menu_makanan[count] = {
                    "nama" : nama_makanan,
                    "harga": harga_makanan,
                    "jumlah": jumlah_makanan,
                    "orang" : {}
                }
                print(f"Berhasil menyimpan '{menu_makanan[count]["nama"]}' dengan harga Rp {menu_makanan[count]['harga']}, dan jumlah x{menu_makanan[count]['jumlah']}")
                harga_total += harga_makanan * jumlah_makanan
            except ValueError:
                print("Input harga tidak valid. Harap masukkan angka.")
            condLoop = input(f"\n\nMasukkan makanan lagi? (Y/N): ")
            if condLoop.upper() == 'N':
                break
        return menu_makanan
    
    
    # Masukkan jumlah orang
    def struktur_user():
        while True:
            try:
                jumlah_orang = int(input("Masukkan jumlah orang: "))
                if jumlah_orang <= 0:
                    print("Jumlah orang harus lebih dari nol. Coba lagi.")
                    continue
                break
            except ValueError:
                print("Input tidak valid. Harap masukkan angka bulat.")
    #Masukkan nama tiap orang
        pengguna = {}
        for i in range(jumlah_orang):
            nama = input(f"Masukkan Nama ke-{i+1}: ")
            pengguna[i] = {
                "nama" : nama,
                "items" : {},
                "harga" : 0
            }
        return pengguna

        #Ini buat append belum ada input dan logic buat append dan delete
    def fungsi_append(info_makanan,pengguna):
        print(f"Makanan dimakan oleh?\n")
        for urutan_pengguna, info_pengguna in pengguna.items():
            print(f"{urutan_pengguna+1}. {info_pengguna["nama"]}")
        pilihan = int(input(f"\nMasukkan pilihan: "))

        while True:
            try:
                jumlah = float(input(f"{pengguna[pilihan-1]["nama"]} berapa {info_makanan["nama"]} (tersisa {info_makanan["jumlah"]}): "))
                if 0 < jumlah <= info_makanan["jumlah"]:
                    break
                else:
                    print(f"Jumlah yang dimasukkan tidak valid. Harap masukkan antara 0 hingga {info_makanan['jumlah']}.")
            except ValueError:
                print("Input tidak valid. Harap masukkan angka.")

        info_makanan["jumlah"] -= jumlah
        info_makanan["orang"][pengguna[pilihan-1]["nama"]] = jumlah + info_makanan["orang"].get(pengguna[pilihan-1]["nama"],0)
        pengguna[pilihan-1]["items"][info_makanan["nama"]] = jumlah + pengguna[pilihan-1]["items"].get(info_makanan["nama"],0)
        pengguna[pilihan-1]["harga"] += jumlah * info_makanan["harga"]
   
    #Fungsi append dan remove user untuk makanan yang dipilih 
    
    #Ini buat remove
    def fungsi_remove(info_makanan,pengguna):
        print(f"Makanan dimakan oleh?\n")
        for urutan_pengguna, info_pengguna in pengguna.items():
            if info_pengguna["items"].get(info_makanan["nama"],0) > 0:
                print(f"{urutan_pengguna+1}. {info_pengguna["nama"]} (x{info_pengguna["items"][info_makanan["nama"]]})")
        pilihan = int(input(f"\nMasukkan pilihan: "))
        while True:
            try:
                jumlah = float(input(f"Dari pengguna {pengguna[pilihan-1]["nama"]} berapa {info_makanan["nama"]} yang ingin dihapus? (tersisa {pengguna[pilihan-1]["items"][info_makanan["nama"]]}): "))
                if 0 < jumlah < pengguna[pilihan-1]["items"][info_makanan["nama"]]:
                    break
                else: 
                    print(f"Masukkan angka di antara 0 dan {pengguna[pilihan-1]["items"][info_makanan["nama"]]}")
            except ValueError:
                print()
        
        info_makanan["jumlah"] += jumlah
        info_makanan["orang"][pengguna[pilihan-1]["nama"]] = info_makanan["orang"].get(pengguna[pilihan-1]["nama"],0) - jumlah
        pengguna[pilihan-1]["items"][info_makanan["nama"]] = pengguna[pilihan-1]["items"].get(info_makanan["nama"],0) - jumlah
        pengguna[pilihan-1]["harga"] -= jumlah * info_makanan["harga"]

    def fungsi_makanan(key,menu_makanan,pengguna):
        info_makanan = menu_makanan[key-1]
        while info_makanan["jumlah"] > 0:
            while True:
                try:
                    #Nasi goreng(xAmount): Rp.xxx
                    print(f"{info_makanan["nama"]}({info_makanan['jumlah']}): Rp.{info_makanan['harga']}")
                    #Jika sudah ada yang pesan
                    print(f"dipesan oleh: ({', '.join([f'{nama} (x{jumlah})' for nama, jumlah in info_makanan['orang'].items() if jumlah > 0])})")
                    print(f"\nApa yang akan dilakukan?")
                    print(f"1.Append")
                    print(f"2.Remove")
                    print(f"3.Exit")
                    pilihan = input(f"Pilihan anda: ")
                    if pilihan == '1':
                        fungsi_append(info_makanan,pengguna)
                    elif pilihan == '2':
                        fungsi_remove(info_makanan,pengguna)
                    elif pilihan == '3':
                        break
                except ValueError:
                    print("Input tidak valid. Harap masukkan angka bulat.")

            #list orang ada siapa aja
            #list orang yang ada + amount yang udah di assign kali ya (fungsi)


        #Nah tampilan utama buat assign dan remove orang
    def fungsi_bill(menu_makanan,pengguna):
        while True:
            #Liat semua makanan,harga, quantity, dan siapa saja yang makan 
            print(f"Receipt")
            for key in menu_makanan: ###Loop harus diubah jadi key,information
                print(f"{key+1}. {menu_makanan[key]["nama"]}({menu_makanan[key]["harga"]})")
                print(f"x{menu_makanan[key]["jumlah"]} dipesan oleh ({menu_makanan[key]["orang"]})")

            #Liat semua orang, yang dipesan, dan harga total !!! cek ulang
            for key in pengguna:
                print(f"{pengguna[key]["nama"]}")
                for key_item,value in pengguna[key]["items"].items():
                    print(f"{key_item} x{value}")
                print(f"Harga yang perlu dibayar: Rp.{pengguna[key]["harga"]}")

            #Tanya pilihan makanan
            pilihan = input(f"Apakah masih ada perubahan? (y/n)")

            if pilihan.upper() == 'Y':
                pilihan_makanan = int(input(f"Pilih perubahan pada makanan mana? (1/2/3): "))
                fungsi_makanan(pilihan_makanan,menu_makanan,pengguna)
            else:
                break

    print("--- Split Bill ---")
    harga_akhir()
    menu = struktur_makanan()
    pengguna = struktur_user()
    fungsi_bill(menu,pengguna)

# Menjalankan fungsi utama saat file dieksekusi
if __name__ == "__main__":
    hitung_split_bill()

