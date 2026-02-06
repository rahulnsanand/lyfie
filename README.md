📸 lyfie
========

> _a selfie of your life_

[**lyfie.app**](https://lyfie.app) | [**contact**](mailto:lyfieapp@gmail.com)

***UNDER ACTIVE DEVELOPMENT***

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

📩 support
----------

we believe in building a tool that helps you live better. if you have ideas, issues, or just want to share how **lyfie** has helped you, reach out.

*   **website:** [lyfie.app](https://lyfie.app)
    
*   **email:** [lyfieapp@gmail.com](mailto:lyfieapp@gmail.com)
    