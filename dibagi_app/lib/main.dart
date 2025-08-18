import 'package:flutter/material.dart';
import 'package:dibagi_app/page/home_page.dart';

void main() {
  runApp(DiBagiApp());
}

class DiBagiApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Split Bill',
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    );
  }
}
