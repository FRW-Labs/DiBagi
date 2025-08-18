import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  HomePage({Key? key}) : super(key: key);

  final groups = [
    {
      "title": "TimeZone - Pasific Place",
      "date": "29 Agustus 2025",
      "total": "Rp.612.000,-",
      "people": [
        {"name": "Felix owes you", "amount": "Rp.256.000,-"},
        {"name": "Reynard owes you", "amount": "Rp.128.000,-"},
        {"name": "William owes you", "amount": "Rp.64.000,-"},
      ],
      "your": "Rp.164.000,-",
      "status": "active",
    },
    {
      "title": "Ayam Bang Jago",
      "date": "25 Agustus 2025",
      "total": "Rp.350.000,-",
      "people": [],
      "your": "Rp.0",
      "status": "settled",
    },
    {
      "title": "Block M",
      "date": "31 Agustus 2025",
      "total": "Rp.98.000,-",
      "people": [
        {"name": "Felix owes you", "amount": "Rp.26.000,-"},
        {"name": "Reynard owes you", "amount": "Rp.28.000,-"},
        {"name": "William owes you", "amount": "Rp.14.000,-"},
      ],
      "your": "Rp.4.000,-",
      "status": "active",
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue[50],

      // AppBar dengan shape melengkung
      appBar: AppBar(
        backgroundColor: const Color.fromRGBO(255, 210, 186, 1),
        elevation: 0,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(30)),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              "Groups",
              style: TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.bold,
              ),
            ),

            Text(
              "You are in 10 groups.",
              style: TextStyle(color: Colors.black54, fontSize: 14),
            ),
          ],
        ),
        actions: [
          // jangan lupa ganti gambar
          Padding(
            padding: const EdgeInsets.all(3.0),
            child: Image.asset(
              'assets/icons/iconSplitBill.png',
              height: 90,
              width: 90,
              fit: BoxFit.contain,
            ),
          ),
        ],
      ),

      // 🔹 Body
      body: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: groups.length,
        itemBuilder: (context, index) {
          final group = groups[index];
          return GroupCard(
            title: group["title"].toString(),
            date: group["date"].toString(),
            total: group["total"].toString(),
            people: List<Map<String, String>>.from(group["people"] as List),
            your: group["your"].toString(),
            status: group["status"].toString(),
          );
        },
      ),

      // BottomAppBar dengan dekorasi rounded top
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Color.fromRGBO(255, 210, 186, 1),
          borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
          boxShadow: [
            BoxShadow(
              color: Colors.black26,
              blurRadius: 8,
              offset: Offset(0, -2),
            ),
          ],
        ),
        child: BottomAppBar(
          color: Colors.transparent, // transparan
          elevation: 0,
          shape: const CircularNotchedRectangle(),
          notchMargin: 8,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              IconButton(onPressed: () {}, icon: const Icon(Icons.groups)),
              IconButton(onPressed: () {}, icon: const Icon(Icons.person_add)),
              const SizedBox(width: 48),
              IconButton(onPressed: () {}, icon: const Icon(Icons.person)),
            ],
          ),
        ),
      ),

      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: Color.fromRGBO(200, 255, 186, 1),
        child: const Icon(Icons.add),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }
}

class GroupCard extends StatelessWidget {
  final String title, date, total, your, status;
  final List<Map<String, String>> people;

  const GroupCard({
    Key? key,
    required this.title,
    required this.date,
    required this.total,
    required this.people,
    required this.your,
    required this.status,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Nama receipt + total
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    // Gambar di sebelah kiri
                    Image.asset(
                      'assets/icons/iconSplitBill.png',
                      height: 32,
                      width: 32,
                    ),
                    const SizedBox(width: 8),

                    // Title + Date
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          date,
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                // Total harga tetap di kanan
                Container(
                  height: 40,
                  alignment: Alignment.center,
                  child: Text(
                    total,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ),
              ],
            ),
            Row(
              children: [
                SizedBox(
                  width: 334,
                  child: Divider(indent: 3, color: Colors.black, thickness: 1),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // People list
            if (people.isNotEmpty)
              Column(
                children:
                    people.map((p) {
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 2),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(p["name"]!),
                            Text(
                              p["amount"]!,
                              style: const TextStyle(
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
              ),

            const SizedBox(height: 12),

            // Status
            if (status == "active")
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color.fromRGBO(200, 255, 186, 1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  "Your own: $your",
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              )
            else
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color.fromRGBO(255, 210, 186, 1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  "Settled up",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
