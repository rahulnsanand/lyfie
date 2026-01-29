<p align="center"> 
    <br/>
        <a href="https://opensource.org/license/agpl-v3"><img src="https://img.shields.io/badge/License-AGPL_v3-blue.svg?color=3F51B5&style=for-the-badge&label=License&logoColor=000000&labelColor=ececec" alt="License: AGPLv3"></a> 
</p>

<p align="center">
    <h3 align="center">lyfie</h3>
    <h6 align="center">a selfie of your life</h3>
</p>
<br/>

🌿 the vision
-------------

most apps capture bits and pieces of you—your fitness, your bank account, or your notes. **lyfie** is designed to be the "wide-angle lens" for your entire existence. it’s a single-container dashboard that aggregates the quantitative (expenses, habits) and the qualitative (journal, mood) to give you a true portrait of who you are and who you’re becoming.

**ownership matters.** because this is your life data, **lyfie** is built to be self-hosted. your data stays on your hardware, under your control.

🛠 features
-----------

### 🏃 performance & growth

*   **habit tracker:** build consistency with streak tracking and visual progress heatmaps.
    
*   **to-do & shopping lists:** stay organized with daily task management and categorized shopping lists.
    
*   **weekly & monthly goals:** connect your daily grind to your long-term vision.
    

### 🧠 reflection & wellness

*   **daily journal:** a beautiful, rich-text space for your thoughts.
    
*   **mood & physical tracker:** log how you feel and track physical metrics over time.
    
*   **monthly gratitude:** a dedicated space to reflect on the wins of the month.
    
*   **moment of the year:** flag special memories to create a year-end highlight reel.
    

### 💰 life admin

*   **expense tracker:** monitor your spending habits with clean category-wise breakdowns.
    
*   **important dates:** never miss a birthday, anniversary, or milestone again.
    
*   **bucket list:** curate your life's greatest ambitions in a visual gallery.
    

🤖 the brain
------------

**lyfie** isn't just a database; it’s an interactive partner. through a secondary lightweight ai container, **lyfie** analyzes your data to provide:

*   **daily motivation:** personalized prompts based on your current goals.
    
*   **morning insights:** "you've been feeling stressed lately; perhaps skip the coffee and focus on your meditation today?"
    
*   **thought for the day:** ai-generated retrospective of your week’s highs and lows.
    

🏗 self-hosting & architecture
------------------------------

**lyfie** is designed as a modular system distributed via a single docker image.

### tech stack

*   **frontend:** react + vite.
    
*   **backend:** .net core 8.
    
*   **auth:** rbac (admin/owner) or oidc integration (authentik).
    
*   **jobs:** quartz.net for daily data processing.
    

### quick start
``` shell
# pull the latest image  docker pull lyfie/app:latest and run the container  
docker run -d \    
    -p 8080:80 \    
    -e connection_string="your_db_connection_here" \    
    --name lyfie-app \    
    lyfie/app:latest
```     

> **note:** the first user to register automatically becomes the **administrator**, granting access to admin configurations.

### Repository activity

![Activities](https://repobeats.axiom.co/api/embed/d3165678e47e1e7e3d35546bb365a078902938b7.svg "Repobeats analytics image")

### Star History

<a href="https://www.star-history.com/#lyfie-app/lyfie&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=lyfie-app/lyfie&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=lyfie-app/lyfie&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=lyfie-app/lyfie&type=date&legend=top-left" />
 </picture>
</a>

### Contributors
<a href="https://github.com/lyfie-app/lyfie/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lyfie-app/lyfie" />
</a>



📩 support
----------

we believe in building a tool that helps you live better. if you have ideas, issues, or just want to share how **lyfie** has helped you, reach out.

*   **website:** [lyfie.app](https://lyfie.app)
    
*   **email:** [lyfieapp@gmail.com](mailto:lyfieapp@gmail.com)
    