# 777 QUEST MENU TEMPLATE

A Frida-based mod menu template for GorillaLocomotion VR games on Android (Meta Quest).  
Licensed under **GNU GPL v2.0**. If you use this template, your project must remain open-source and include credit to **{777}** and **goldentrophy**.

---

## What is this?

The 777 Quest Menu is a lightweight, easy-to-edit template for creating mod menus using Frida on Quest devices.  
It includes a simple UI system, category structure, notification system, and credit protection logic.

---

## Supported Games

This template is intended for Android-based VR games that use GorillaLocomotion.  
Examples include:

- Gorilla Tag  
- Fearing Gorilla  
- Most Gorilla Tag fan games  
- Any other Quest VR game using GorillaLocomotion

---

## Why use this template?

- Frida-based (one of the few proper Quest menu templates)  
- Fully open-source  
- Prebuilt menu logic (notifications, categories, credits, movement features)  
- Easy to modify and expand  
- Lightweight and straightforward for developers

This template is ideal for developers who want a clean starting point instead of working with messy, unmaintained code.

---

## License Requirements

This project uses the **GNU GPL v2.0** license.  
By using this template, you agree to:

1. Keep your project open-source under GPL v2.0.  
2. Provide visible credit to:
   - `{777}` — main developer  
   - `goldentrophy` — base/canvas logic

If you cannot follow these rules, you are not allowed to use this code.

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/777-arc/777-QUESTMENU.git

# Inject into your Quest game using Frida
frida -U -l 777menu.js com.example.gorillagame
