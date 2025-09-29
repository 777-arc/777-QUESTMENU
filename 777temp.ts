//777 menu templete!
//global menu for games based off of Gorillalocomotion
//I CODED THIS AT LIKE 1AM AND FINISHED AT AROUND 4AM IF YOU FIND ISSUES DM AT *discord: c0neguyy* OR REPORT THEM ON GITHUB *https://github.com/777-arc/777-QUESTMENU*
//ALSO ALL ERRORS ARE FALSE ONCE YOU COMPILE THEM THEY WONT EFFECT THE MENU AT ALL

// DECS
declare const Il2Cpp: any;
declare const console: any;

//DONT TOUCH UNLESS YOU SKID WHICH YOU PROP ARE SINCE UR USING THIS.
const creditNames = Object.freeze(["{777}", "goldentrophy"]);

function verifyCredits() {
  try {
    if (
      !Array.isArray(creditNames) ||
      creditNames.length !== 2 ||
      creditNames[0] !== "{777}" ||
      creditNames[1] !== "goldentrophy"
    ) {
      throw new Error("Credits edited");
    }
  } catch (e) {
    console.error("[777 MENU] CREDITS MODIFIED");
    Il2Cpp.perform(() => {
      const GTPlayer = Il2Cpp.domain
        .assembly("Assembly-CSharp")
        .image.class("GorillaLocomotion.Player")
        .field("Instance").value;
      const LateUpdate = GTPlayer.class.method("LateUpdate");
      LateUpdate.implementation = function () {
        throw new Error("MENU SELF-DESTRUCT");
      };
    });
  }
}

//global stuff DONT TOUCH
let menu: any = null;
let time = 0.0;
let deltaTime = 0.0;
let leftSecondary = false;

let bgColor: [number, number, number, number] = [0.1, 0.1, 0.1, 0.85];
let textColor: [number, number, number, number] = [1, 1, 1, 1];
let buttonColor: [number, number, number, number] = [0.2, 0.2, 0.2, 0.8];
let buttonPressedColor: [number, number, number, number] = [0.8, 0.2, 0.2, 1];

let menuName = "<b>!777 MENU!</b>"; //<-- change 777 MENU to your menu name
let currentCategory = 0;

//notifications
let notifObject: any = null;
let notifTimer = 0.0;

//  util fucs DONT TOUCH
function showNotification(canvas: any, text: string) {
  if (notifObject) {
    notifObject.method("SetActive").invoke(false);
    notifObject = null;
  }
  notifObject = createObject([0.11, 0, -0.25], identityQuaternion, [1, 0.1], 0, [0,0,0,0], getTransform(canvas));
  const txtComp = notifObject.method("AddComponent", 1).inflate(Text).invoke();
  txtComp.method("set_text").invoke(Il2Cpp.string(text));
  txtComp.method("set_font").invoke(arial);
  txtComp.method("set_color").invoke([1, 1, 1, 1]);
  txtComp.method("set_alignment").invoke(4);
  notifTimer = time + 2.5;
}

// cat button stuff idk
class ButtonInfo {
  buttonText: string;
  method?: () => void;
  isTogglable: boolean;
  enabled: boolean;
  constructor(txt: string, method: () => void = null, toggle = false) {
    this.buttonText = txt;
    this.method = method;
    this.isTogglable = toggle;
    this.enabled = false;
  }
}

//injection point. DO NOT TOUCH UNLESS YOU KNOW WHAT YOU ARE DOING.
//THIS IS WHERE IT LOADS ALL CLASSES AND STUFF AND WHERE IT INJECTS THE LATEUPDATE HOOK SO PLEASE DONT TOUCH
document.addEventListener("DOMContentLoaded", () => {
  Il2Cpp.perform(() => {
    verifyCredits();

    const asm = Il2Cpp.domain.assembly("Assembly-CSharp").image; //<- regs Assembly-CSharp
    const core = Il2Cpp.domain.assembly("UnityEngine.CoreModule").image; //<- regs UnityEngine.CoreModule
    const input = Il2Cpp.domain.assembly("UnityEngine.InputLegacyModule").image; //<- regs UnityEngine.InputLegacyModule
    const ui = Il2Cpp.domain.assembly("UnityEngine.UI").image; //<- regs UnityEngine.UI
    const uim = Il2Cpp.domain.assembly("UnityEngine.UIModule").image; //<- regs UnityEngine.UIModule
    const textRender = Il2Cpp.domain.assembly("UnityEngine.TextRenderingModule").image; //<- regs UnityEngine.TextRenderingModule

    const GameObject = core.class("UnityEngine.GameObject"); //<- regs GameObject
    const Object = core.class("UnityEngine.Object"); //<- regs Object
    const Vector3 = core.class("UnityEngine.Vector3"); //<- regs Vector3
    const Quaternion = core.class("UnityEngine.Quaternion"); //<- regs Quaternion
    const Time = core.class("UnityEngine.Time"); //<- regs Time
    const Input = input.class("UnityEngine.Input"); //<- regs Input
    const Renderer = core.class("UnityEngine.Renderer"); //<- regs Renderer
    const Canvas = uim.class("UnityEngine.Canvas"); //<- regs Canvas
    const CanvasScaler = ui.class("UnityEngine.UI.CanvasScaler");  //<- regs CanvasScaler
    const GraphicRaycaster = ui.class("UnityEngine.UI.GraphicRaycaster"); //<- regs GraphicRaycaster
    const Text = ui.class("UnityEngine.UI.Text"); //<- regs Text
    const Font = textRender.class("UnityEngine.Font"); //<- regs Font

    const zeroVector = Vector3.field("zeroVector").value; //<- regs zeroVector
    const oneVector = Vector3.field("oneVector").value; //<- regs oneVector
    const identityQuaternion = Quaternion.field("identityQuaternion").value; //<- regs identityQuaternion

    const arial = Il2Cpp.domain.assembly("UnityEngine.CoreModule")
      .image.class("UnityEngine.Resources")
      .method("GetBuiltinResource", 1)
      .inflate(Font)
      .invoke(Il2Cpp.string("Arial.ttf"));

    function Destroy(obj: any) {
      Object.method("Destroy", 1).invoke(obj);
    }
    function getTransform(obj: any) {
      return obj.method("get_transform").invoke();
    }
    function createObject(
      pos = zeroVector,
      rot = identityQuaternion,
      scale = oneVector,
      primitiveType = 3,
      color: [number, number, number, number] = [1,1,1,1],
      parent: any = null
    ) {
      const obj = GameObject.method("CreatePrimitive").invoke(primitiveType);
      const rend = obj.method("GetComponent", 1).inflate(Renderer).invoke();
      const mat = rend.method("get_material").invoke();
      mat.method("set_color").invoke(color);
      const t = getTransform(obj);
      if (parent) t.method("SetParent", 2).invoke(parent, false);
      t.method("set_position").invoke(pos);
      t.method("set_rotation").invoke(rot);
      t.method("set_localScale").invoke(scale);
      return obj;
    }
    function renderMenuText(canvas: any, text: string, color = [1,1,1,1], pos = zeroVector) {
      const txt = createObject(pos, identityQuaternion, oneVector, 0, [0,0,0,0], getTransform(canvas));
      const tComp = txt.method("AddComponent", 1).inflate(Text).invoke();
      tComp.method("set_text").invoke(Il2Cpp.string(text));
      tComp.method("set_font").invoke(arial);
      tComp.method("set_color").invoke(color);
      tComp.method("set_alignment").invoke(4);
      return txt;
    }

    //main menu render! DONT TOUCH OTEHRWISE THE MENU WONT LOAD AT ALL
    //ONLY EDIT IF YOU KNOW WHAT U R DOING
    function renderMenu() {
      menu = createObject(zeroVector, identityQuaternion, [0.1, 0.3, 0.38], 3, [0,0,0,0]);
      const bg = createObject([0.1, 0, 0], identityQuaternion, [0.1, 1, 1], 3, bgColor, getTransform(menu));

      const canvas = createObject(zeroVector, identityQuaternion, oneVector, 3, [0,0,0,0], getTransform(menu));
      canvas.method("AddComponent", 1).inflate(Canvas).invoke();
      canvas.method("AddComponent", 1).inflate(CanvasScaler).invoke();
      canvas.method("AddComponent", 1).inflate(GraphicRaycaster).invoke();

      renderMenuText(canvas, menuName, textColor, [0.11, 0, 0.175]);
      renderMenuButtons(canvas);
      recenterMenu();
    }

    function recenterMenu() {
      const GorillaTagger = asm.class("GorillaTagger").field("_instance").value;
      const leftHand = GorillaTagger.field("leftHandTransform").value;
      const menuT = getTransform(menu);
      menuT.method("set_position").invoke(leftHand.method("get_position").invoke());
      menuT.method("set_rotation").invoke(leftHand.method("get_rotation").invoke());
    }

    //start buttons
    const buttons: ButtonInfo[][] = [
      [ // buttons
        new ButtonInfo("Credits", () => currentCategory = 1), //<- cat1 (DONT REMOVE. THIS.)
        new ButtonInfo("Settings", () => currentCategory = 2), //<- cat2
        new ButtonInfo("Movement", () => currentCategory = 3), //<- cat3
        new ButtonInfo("Fun", () => currentCategory = 4), //<- cat4
        new ButtonInfo("Utility", () => currentCategory = 5), //<- cat5
        //you can add more buttons js follow the structure from above 
      ],

      [ //creds
        new ButtonInfo("Back", () => currentCategory = 0),
        new ButtonInfo("{777}", () => showNotification(menu, "Mod maker & remaker")), //<- ME do not remove. or if u do credit me somewhere else atleast :]
        new ButtonInfo("goldentrophy", () => showNotification(menu, "Old menu logic. Base canvas was made by this dude")), //<- massive credit to him for the base canvas logic!
      ],

      [ //settings
        new ButtonInfo("Back", () => currentCategory = 0), //<- back button. returns to the home
        new ButtonInfo("Theme Switch", () => {
          bgColor = [Math.random(), Math.random(), Math.random(), 0.9];
          reloadMenu();
        }),
        new ButtonInfo("Test", () => {
          console.log("custom settings logic HERE"); //<- delete this line and code your own logic. yes under the button
        }),
      ],

      [ //movement
        new ButtonInfo("Back", () => currentCategory = 0), //<- back button. returns to the home
        new ButtonInfo("Long Arms", () => {
          const GorillaTagger = asm.class("GorillaTagger").field("_instance").value;  //i made this at 1am or something, might be broken or not work legit dont know
          getTransform(GorillaTagger).method("set_localScale").invoke([1.3, 1.3, 1.3]);
        }),
        new ButtonInfo("Test", () => {
          console.log("custom movement logic HERE"); //<- delete this line and code your own logic. yes under the button
        }),
      ],

      [ //fun
        new ButtonInfo("Back", () => currentCategory = 0), //<- back button. returns to the home
        new ButtonInfo("Test", () => {
          console.log("custom fun logic HERE"); //<- delete this line and code your own logic. yes under the button
        }),
      ],

      [ //utils
        new ButtonInfo("Back", () => currentCategory = 0), //<- back button. returns to the home
        new ButtonInfo("Test", () => { //<- Custom logic. Meant for a menu templete button
          console.log("custom utils logic HERE"); //<- delete this line and code your own logic. yes under the button
        }),
      ],
    ];

    //button render. All it does is renders the buttons (ONCE AGAIN DO. NOT. TOUCH)
    function renderMenuButtons(canvas: any) {
      let i = 0;
      const target = buttons[currentCategory];
      target.forEach((b) => {
        createObject([0.105, 0, 0.13 - (i * 0.04)], identityQuaternion, [0.09, 0.9, 0.08], 3, buttonColor, getTransform(menu));
        renderMenuText(canvas, b.buttonText, textColor, [0.11, 0, 0.13 - (i * 0.04)]);
        i++;
      });
    }

    //reloading menu (AGAIN DONT TOUCH.)
    function reloadMenu() {
      if (menu) { Destroy(menu); menu = null; }
      renderMenu();
    }

    // upd hook (DONT FOR THE LOVE OF HEAVEN TOUCH THIS)
    const GTPlayer = asm.class("GorillaLocomotion.Player").field("Instance").value;
    const LateUpdate = GTPlayer.class.method("LateUpdate");
    LateUpdate.implementation = function () {
      deltaTime = Time.method("get_deltaTime").invoke();
      time = Time.method("get_time").invoke();

      if (notifObject && time > notifTimer) {
        notifObject.method("SetActive").invoke(false);
        notifObject = null;
      }

      if (leftSecondary) {
        if (!menu) renderMenu(); else recenterMenu();
      } else if (menu) {
        Destroy(menu);
        menu = null;
      }

      return LateUpdate.invoke();
    };

    console.log("[777] injected.");
  });
});
