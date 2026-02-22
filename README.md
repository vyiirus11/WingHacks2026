# 🦋 Circulumn — Women-Centric Academic Support Platform

**Circulumn** is a full-stack web platform that empowers students (especially women and gender-marginalized learners) with tailored academic support, community insight, and data-driven tools to thrive in college.

---

## 🏠 Homepage & Navigation

Circulumn’s homepage provides three core tabs, each delivering impactful academic tools:

### 🗺️ Safe Study Finder
A searchable, filterable list of curated study spaces that students can:
- Browse with **tag filters** like *quiet*, *well-lit*, *late-night*, etc. to locate availible libraries for studying catered to your needs.
- **Add Reviews** to leave community-sourced feedback
- Provides a community-powered resource for safe and effective learning environments.

---

### 🤝 Mentorship Matching

A personalized mentor matching experience:
- Students fill out a **mentee profile form**
  - Major
  - Year
  - Courses needing help
  - Interests
  - Availability
- The server returns a list of **matched mentors** based on overlap and compatibility logic
- Encourages meaningful academic support connections within the community

---

### 📊 Analytics Dashboard

A live analytics view powered by **MongoDB aggregations**:

#### 🔹 Hardest Courses  
Shows courses with the highest average stress reports based on student stress logs.

#### 🔹 Stress Trend  
Tracks stress patterns across course loads, helping identify systemic stress points.

#### 🔹 Top Study Spaces  
A composite ranking of study locations based on community confidence, safety, and user feedback.

#### 🔹 Safety Flags  
Highlights study spaces with potential safety concerns via flagged tags and reports.

All analytics are computed in real-time from the database and exposed in an easy-to-interpret dashboard.

---

## 🧠 Key Technologies

Circulumn makes strong use of **MongoDB Atlas**:

✨ Multiple collections with well-structured schemas:
- Users
- Mentors
- Reviews
- Stress reports
- Study spaces

🛠️ Advanced database features:
- **Aggregation pipelines** for analytics
- **Text search–ready fields** for efficient filtering
- Scalable, cloud-ready database integration with Atlas

---

## 🎓 Core Value Themes

### 📘 Education
Circulumn brings together tools to:
- Optimize study time and location
- Connect learners with mentors
- Surface data-backed academic insights

### 💖 Women-Centric Support
Built with intentional focus on:
- Safety and inclusivity in physical and virtual spaces
- Resources targeted at women and gender-marginalized students
- Flattening barriers to mentorship and academic participation

---

## 🚀 Testing
<ol>
<li>Clone the 
<a href="https://github.com/vyiirus11/WingHacks2026.git"> repo: </a>

<br>

```bash
git clone https://github.com/vyiirus11/WingHacks2026.git
```

![clone](/Curriculum/ss/clone.png)
</li>

<br>

- **MAKE SURE** you have <a href="https://desktop.github.com/download/"> GitHub Desktop </a> downloaded
<li>To access a local host preview of the platform, download the extension 
    <a href="https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server"
    >
    Live Preview
    </a>
    in 
    <a href="https://code.visualstudio.com/download">
    Visual Studio Code (VSCode):
    </a>

<br>

![live](/Curriculum/ss/live.png)

<br>

- **MAKE SURE** the extension is enabled and everything is updated
- **MAKE SURE** you have index.html opened (this is where you will be able to locally open the webpage using the extension)

<br>

![live](/Curriculum/ss/preview.png)

</br>

- You should be able to see the webpage tab popup to the side
</ol>