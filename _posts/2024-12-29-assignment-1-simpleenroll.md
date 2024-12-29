---
layout: post
title: "Assignment 1: SimpleEnroll"
date: 2024-12-29 22:11:11 +0800
categories: [CS106L]
tags: [cpp]
---

# 对于本assignment而言我们需要完成下面三个目标

+ 将course.csv当中的内容解析到Course数组当中
+ 将Course数组当中的offered_course写入到courses_offered.csv当中，并且从数组中删除这些课程
+ 将剩余的课程写入courses_not_offered.csv当中

主要归结下来就是：
+ fstream的应用
+ getline的使用

# 具体实现

+ parse_csv
```c++
void parse_csv(std::string filename, std::vector<Course>& courses) {
  /* (STUDENT TODO) Your code goes here... */
  std::ifstream file(filename);

  std::string line;
  std::getline(file, line);  

  while (std::getline(file, line)) {
    std::vector<std::string> fields = split(line, ',');
    if (fields.size() != 3) {
      std::cerr << "Error: invalid line in CSV file" << std::endl;
      continue;
    }

    Course course;
    course.title = fields[0];
    course.number_of_units = fields[1];
    course.quarter = fields[2]; 
    courses.push_back(course);
  }
  file.close();
}
```
**ifstream**是从文件流解析数据，通过**getline**一行一行地读取。
+ write_courses_offered
```c++
void write_courses_offered(std::vector<Course>& all_courses) {
  /* (STUDENT TODO) Your code goes here... */
  std::ofstream output(COURSES_OFFERED_PATH);
  std::ifstream input("courses.csv");

  std::string header;
  getline(input, header);
  output << header << "\n";
  std::string line;
  std::vector<Course> offered_courses;
  for (auto &c : all_courses) {
    if (c.quarter != "null") {
      offered_courses.push_back(c);
      output << c.title << "," << c.number_of_units << "," << c.quarter << "\n";
    }
  }
  for (auto &c : offered_courses) {
    delete_elem_from_vector(all_courses, c);
  }
}
```
**ofstream**是写入数据

+ write_courses_not_offered
```c++
void write_courses_not_offered(std::vector<Course> unlisted_courses) {
  /* (STUDENT TODO) Your code goes here... */
  std::ofstream output(COURSES_NOT_OFFERED_PATH);
  std::ifstream input("courses.csv");
  std::string header;
  getline(input, header);
  output << header << "\n";
  for (auto &c : unlisted_courses) {
    output << c.title << "," << c.number_of_units << "," << c.quarter << "\n";
  }
  output.close();
}
```

  
