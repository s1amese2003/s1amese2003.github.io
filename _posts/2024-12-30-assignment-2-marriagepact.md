---
layout: post
title: "assignment-2-marriage_pact"
date: 2024-12-30 12:02:20 +0800
categories: [CS106L]
tags: [cpp]
---

# assignment-2-marriage_pact

这个assignment和上一次内容差别不大，主要需要掌握**ifstream**、**getline**和**istringstream**的使用，**ifstream**、**getline**已经在上一篇讲过了，**istringstream**也主要是对字符串的读取，例如下面我们读入一个字符串 **"1 abc def"**
```c++
#include <sstream>
int main() {
    std::string s = "1 abc def";
    int id;
    std::string str1, str2;
    std::istringstream iss(s);
    iss >> id >> str1 >> str2;
}
```
这样就可以对字符串**s**进行分割。

下面是assignment的主要内容

```c++
std::set<std::string> get_applicants(std::string filename) {
    // STUDENT TODO: Implement this function.
    std::set<std::string> applicants;
    std::ifstream input(filename);
    if (!input.is_open()) {
      throw std::runtime_error("Could not open file.");
    }

    std::string name;
    while (std::getline(input, name)) {
      if (!name.empty()) { 
      applicants.insert(name);
      }
    }

    input.close();

    return applicants;
  }
```

```c++
std::queue<const std::string*> find_matches(std::string name, std::set<std::string>& students) {
    // STUDENT TODO: Implement this function.
    std::istringstream iss(name);
    std::string first_name, last_name;
    iss >> first_name >> last_name;
    std::queue<const std::string*> matches; 
    for (const std::string& student : students) {
      std::istringstream iss(student);
      std::string student_first_name, student_last_name;
      iss >> student_first_name >> student_last_name;
      if (first_name[0] == student_first_name[0] && last_name[0] == student_last_name[0]) {
        matches.push(&student);
      }
    }
    return matches;
  }
```

```c++
std::string get_match(std::queue<const std::string*>& matches) {
    // STUDENT TODO: Implement this function.
    if (matches.empty()) {
      return "NO MATCHES FOUND.";
    }
    return *matches.front();
  }
```