//777 menu templete!
//global menu for games based off of Gorillalocomotion
//I CODED THIS AT LIKE 1AM AND FINISHED AT AROUND 4AM IF YOU FIND ISSUES DM AT *discord: c0neguyy* OR REPORT THEM ON GITHUB *https://github.com/777-arc/777-QUESTMENU*
//THIS IS UNDER THE GNU V2.0 LICENSE. MEANING IF YOU USE IT YOU MUST MAKE IT OPEN SOURCE AND GIVE CREDIT TO ME {777} AND GOLDENTROPHY
//IF YOU SKID THIS AND DONT GIVE CREDIT TO ME OR GOLDENTROPHY YOU ARE A LAZY PIECE OF SKID WHO DOESNT DESERVE TO USE THIS CODE ACCEPT IT.
//ALSO ALL ERRORS ARE FALSE ONCE YOU COMPILE THEM THEY WONT EFFECT THE MENU AT ALL

// DECS
declare const Il2Cpp: any; //<- lets us use il2cpp stuff for unity
declare const console: any; //<- lets us use console log for debug

//DONT TOUCH UNLESS YOU SKID WHICH YOU PROP ARE SINCE UR USING THIS.
const creditNames = Object.freeze(["{777}", "goldentrophy"]); //<- stores the credits names so they cant be changed

function verifyCredits() { //<- this function makes sure credits arent changed
  try { //<- try to check if credits are ok
    if ( //<- start checking if credits are modified
      !Array.isArray(creditNames) || //<- checks if creditnames is still an array
      creditNames.length !== 2 || //<- checks if there are still 2 names
      creditNames[0] !== "{777}" || //<- checks if first name is still mine
      creditNames[1] !== "goldentrophy" //<- checks if second name is still goldentrophy
    ) { //<- end of credit check conditions
      throw new Error("Credits edited"); //<- throw error if credits were changed
    } //<- end of if statement
  } catch (e) { //<- catch any errors from the check
    console.error("[777 MENU] CREDITS MODIFIED"); //<- show error in console
    Il2Cpp.perform(() => { //<- start il2cpp stuff to break the game
      const GTPlayer = Il2Cpp.domain //<- get the domain
        .assembly("Assembly-CSharp") //<- get assembly csharp
        .image.class("GorillaLocomotion.Player") //<- get player class
        .field("Instance").value; //<- get player instance
      const LateUpdate = GTPlayer.class.method("LateUpdate"); //<- get lateupdate method
      LateUpdate.implementation = function () { //<- replace lateupdate with our version
        throw new Error("MENU SELF-DESTRUCT"); //<- crash the game if credits changed
      }; //<- end of new lateupdate function
    }); //<- end of il2cpp perform
  } //<- end of catch
} //<- end of verifycredits function

//global stuff DONT TOUCH
let menu: any = null; //<- stores the menu object
let time = 0.0; //<- keeps track of game time
let deltaTime = 0.0; //<- keeps track of time between frames
let leftSecondary = false; //<- tracks if menu button is pressed

let bgColor: [number, number, number, number] = [0.1, 0.1, 0.1, 0.85]; //<- color for menu background
let textColor: [number, number, number, number] = [1, 1, 1, 1]; //<- color for menu text
let buttonColor: [number, number, number, number] = [0.2, 0.2, 0.2, 0.8]; //<- color for normal buttons
let buttonPressedColor: [number, number, number, number] = [0.8, 0.2, 0.2, 1]; //<- color for pressed buttons

let menuName = "<b>!777 MENU!</b>"; //<- name shown at top of menu
let currentCategory = 0; //<- which menu category is currently open

//notifications
let notifObject: any = null; //<- stores the notification object
let notifTimer = 0.0; //<- tracks when to hide notification

function showNotification(canvas: any, text: string) { //<- function to show popup messages
  if (notifObject) { //<- check if notification already exists
    notifObject.method("SetActive").invoke(false); //<- hide old notification
    notifObject = null; //<- clear old notification
  } //<- end of if statement
  notifObject = createObject([0.11, 0, -0.25], identityQuaternion, [1, 0.1], 0, [0,0,0,0], getTransform(canvas)); //<- create new notification object
  const txtComp = notifObject.method("AddComponent", 1).inflate(Text).invoke(); //<- add text component to notification
  txtComp.method("set_text").invoke(Il2Cpp.string(text)); //<- set notification text
  txtComp.method("set_font").invoke(arial); //<- set notification font
  txtComp.method("set_color").invoke([1, 1, 1, 1]); //<- set notification text color
  txtComp.method("set_alignment").invoke(4); //<- center the notification text
  notifTimer = time + 2.5; //<- set notification to disappear after 2.5 seconds
} //<- end of shownotification function

class ButtonInfo { //<- class for storing button data
  buttonText: string; //<- text shown on button
  method?: () => void; //<- function called when button pressed
  isTogglable: boolean; //<- if button can be toggled on off
  enabled: boolean; //<- current toggle state
  constructor(txt: string, method: () => void = null, toggle = false) { //<- setup new button
    this.buttonText = txt; //<- set button text
    this.method = method; //<- set button function
    this.isTogglable = toggle; //<- set if button toggles
    this.enabled = false; //<- start with button off
  } //<- end of constructor
} //<- end of buttoninfo class

document.addEventListener("DOMContentLoaded", () => { //<- wait for page to load
  Il2Cpp.perform(() => { //<- start il2cpp stuff
    verifyCredits(); //<- check if credits are intact

    const asm = Il2Cpp.domain.assembly("Assembly-CSharp").image; //<- get main game code
    const core = Il2Cpp.domain.assembly("UnityEngine.CoreModule").image; //<- get unity core stuff
    const input = Il2Cpp.domain.assembly("UnityEngine.InputLegacyModule").image; //<- get input stuff
    const ui = Il2Cpp.domain.assembly("UnityEngine.UI").image; //<- get ui stuff
    const uim = Il2Cpp.domain.assembly("UnityEngine.UIModule").image; //<- get more ui stuff
    const textRender = Il2Cpp.domain.assembly("UnityEngine.TextRenderingModule").image; //<- get text stuff

    const GameObject = core.class("UnityEngine.GameObject"); //<- get gameobject class
    const Object = core.class("UnityEngine.Object"); //<- get object class
    const Vector3 = core.class("UnityEngine.Vector3"); //<- get vector3 class
    const Quaternion = core.class("UnityEngine.Quaternion"); //<- get quaternion class
    const Time = core.class("UnityEngine.Time"); //<- get time class
    const Input = input.class("UnityEngine.Input"); //<- get input class
    const Renderer = core.class("UnityEngine.Renderer"); //<- get renderer class
    const Canvas = uim.class("UnityEngine.Canvas"); //<- get canvas class
    const CanvasScaler = ui.class("UnityEngine.UI.CanvasScaler"); //<- get canvasscaler class
    const GraphicRaycaster = ui.class("UnityEngine.UI.GraphicRaycaster"); //<- get graphicraycaster class
    const Text = ui.class("UnityEngine.UI.Text"); //<- get text class
    const Font = textRender.class("UnityEngine.Font"); //<- get font class

    const zeroVector = Vector3.field("zeroVector").value; //<- get vector3 with all zeros
    const oneVector = Vector3.field("oneVector").value; //<- get vector3 with all ones
    const identityQuaternion = Quaternion.field("identityQuaternion").value; //<- get quaternion with no rotation

    const arial = Il2Cpp.domain.assembly("UnityEngine.CoreModule") //<- start getting arial font
      .image.class("UnityEngine.Resources") //<- get resources class
      .method("GetBuiltinResource", 1) //<- get method to load builtin stuff
      .inflate(Font) //<- specify we want a font
      .invoke(Il2Cpp.string("Arial.ttf")); //<- load arial font

    function Destroy(obj: any) { //<- function to delete unity objects
      Object.method("Destroy", 1).invoke(obj); //<- delete the object
    } //<- end of destroy function
    
    function getTransform(obj: any) { //<- function to get transform component
      return obj.method("get_transform").invoke(); //<- return the transform
    } //<- end of gettransform function
    
    function createObject( //<- function to create game objects
      pos = zeroVector, //<- position in world
      rot = identityQuaternion, //<- rotation in world
      scale = oneVector, //<- size of object
      primitiveType = 3, //<- type of shape 3 is cube
      color: [number, number, number, number] = [1,1,1,1], //<- color of object
      parent: any = null //<- parent object
    ) { //<- start of createobject function body
      const obj = GameObject.method("CreatePrimitive").invoke(primitiveType); //<- create basic shape
      const rend = obj.method("GetComponent", 1).inflate(Renderer).invoke(); //<- get renderer component
      const mat = rend.method("get_material").invoke(); //<- get material
      mat.method("set_color").invoke(color); //<- set color of material
      const t = getTransform(obj); //<- get transform of new object
      if (parent) t.method("SetParent", 2).invoke(parent, false); //<- set parent if provided
      t.method("set_position").invoke(pos); //<- set position
      t.method("set_rotation").invoke(rot); //<- set rotation
      t.method("set_localScale").invoke(scale); //<- set size
      return obj; //<- return the new object
    } //<- end of createobject function
    
    function renderMenuText(canvas: any, text: string, color = [1,1,1,1], pos = zeroVector) { //<- function to create text
      const txt = createObject(pos, identityQuaternion, oneVector, 0, [0,0,0,0], getTransform(canvas)); //<- create invisible object for text
      const tComp = txt.method("AddComponent", 1).inflate(Text).invoke(); //<- add text component
      tComp.method("set_text").invoke(Il2Cpp.string(text)); //<- set text content
      tComp.method("set_font").invoke(arial); //<- set font to arial
      tComp.method("set_color").invoke(color); //<- set text color
      tComp.method("set_alignment").invoke(4); //<- center the text
      return txt; //<- return the text object
    } //<- end of renderMenuText function

    function renderMenu() { //<- function to create the menu
      menu = createObject(zeroVector, identityQuaternion, [0.1, 0.3, 0.38], 3, [0,0,0,0]); //<- create main container
      const bg = createObject([0.1, 0, 0], identityQuaternion, [0.1, 1, 1], 3, bgColor, getTransform(menu)); //<- create background

      const canvas = createObject(zeroVector, identityQuaternion, oneVector, 3, [0,0,0,0], getTransform(menu)); //<- create canvas container
      canvas.method("AddComponent", 1).inflate(Canvas).invoke(); //<- add canvas component
      canvas.method("AddComponent", 1).inflate(CanvasScaler).invoke(); //<- add canvas scaler
      canvas.method("AddComponent", 1).inflate(GraphicRaycaster).invoke(); //<- add raycaster for input

      renderMenuText(canvas, menuName, textColor, [0.11, 0, 0.175]); //<- create menu title
      renderMenuButtons(canvas); //<- create buttons
      recenterMenu(); //<- position menu at hand
    } //<- end of rendermenu function

    function recenterMenu() { //<- function to move menu to hand
      const GorillaTagger = asm.class("GorillaTagger").field("_instance").value; //<- get gorilla tagger
      const leftHand = GorillaTagger.field("leftHandTransform").value; //<- get left hand
      const menuT = getTransform(menu); //<- get menu transform
      menuT.method("set_position").invoke(leftHand.method("get_position").invoke()); //<- set menu position to hand
      menuT.method("set_rotation").invoke(leftHand.method("get_rotation").invoke()); //<- set menu rotation to hand
    } //<- end of recentermenu function

    const buttons: ButtonInfo[][] = [ //<- array of button categories
      [ // main menu buttons
        new ButtonInfo("Credits", () => currentCategory = 1), //<- button to credits menu
        new ButtonInfo("Settings", () => currentCategory = 2), //<- button to settings menu
        new ButtonInfo("Movement", () => currentCategory = 3), //<- button to movement menu
        new ButtonInfo("Fun", () => currentCategory = 4), //<- button to fun menu
        new ButtonInfo("Utility", () => currentCategory = 5), //<- button to utility menu
        //you can add more buttons js follow the structure from above 
      ], //<- end of main menu buttons

      [ //credits menu
        new ButtonInfo("Back", () => currentCategory = 0), //<- button to go back
        new ButtonInfo("{777}", () => showNotification(menu, "Mod maker & remaker")), //<- credit for me
        new ButtonInfo("goldentrophy", () => showNotification(menu, "Old menu logic. Base canvas was made by this dude")), //<- credit for goldentrophy
      ], //<- end of credits menu

      [ //settings menu
        new ButtonInfo("Back", () => currentCategory = 0), //<- button to go back
        new ButtonInfo("Theme Switch", () => { //<- button to change theme
          bgColor = [Math.random(), Math.random(), Math.random(), 0.9]; //<- set random background color
          reloadMenu(); //<- rebuild menu with new color
        }), //<- end of theme switch button
        new ButtonInfo("Test", () => { //<- test button
          console.log("custom settings logic HERE"); //<- placeholder code
        }), //<- end of test button
      ], //<- end of settings menu

      [ //movement menu
        new ButtonInfo("Back", () => currentCategory = 0), //<- button to go back
        new ButtonInfo("Long Arms", () => { //<- long arms button
          const GorillaTagger = asm.class("GorillaTagger").field("_instance").value; //<- get gorilla tagger
          getTransform(GorillaTagger).method("set_localScale").invoke([1.3, 1.3, 1.3]); //<- make player bigger
        }), //<- end of long arms button
        new ButtonInfo("Test", () => { //<- test button
          console.log("custom movement logic HERE"); //<- placeholder code
        }), //<- end of test button
      ], //<- end of movement menu

      [ //fun menu
        new ButtonInfo("Back", () => currentCategory = 0), //<- button to go back
        new ButtonInfo("Test", () => { //<- test button
          console.log("custom fun logic HERE"); //<- placeholder code
        }), //<- end of test button
      ], //<- end of fun menu

      [ //utility menu
        new ButtonInfo("Back", () => currentCategory = 0), //<- button to go back
        new ButtonInfo("Test", () => { //<- test button
          console.log("custom utils logic HERE"); //<- placeholder code
        }), //<- end of test button
      ], //<- end of utility menu
    ]; //<- end of buttons array

    function renderMenuButtons(canvas: any) { //<- function to create buttons
      let i = 0; //<- counter for positioning
      const target = buttons[currentCategory]; //<- get current category buttons
      target.forEach((b) => { //<- loop through each button
        createObject([0.105, 0, 0.13 - (i * 0.04)], identityQuaternion, [0.09, 0.9, 0.08], 3, buttonColor, getTransform(menu)); //<- create button background
        renderMenuText(canvas, b.buttonText, textColor, [0.11, 0, 0.13 - (i * 0.04)]); //<- create button text
        i++; //<- move to next position
      }); //<- end of foreach loop
    } //<- end of rendermenubuttons function

    function reloadMenu() { //<- function to rebuild menu
      if (menu) { Destroy(menu); menu = null; } //<- remove old menu
      renderMenu(); //<- create new menu
    } //<- end of reloadmenu function

    const GTPlayer = asm.class("GorillaLocomotion.Player").field("Instance").value; //<- get player instance
    const LateUpdate = GTPlayer.class.method("LateUpdate"); //<- get lateupdate method
    LateUpdate.implementation = function () { //<- replace lateupdate with our version
      deltaTime = Time.method("get_deltaTime").invoke(); //<- update deltatime
      time = Time.method("get_time").invoke(); //<- update current time

      if (notifObject && time > notifTimer) { //<- check if notification expired
        notifObject.method("SetActive").invoke(false); //<- hide notification
        notifObject = null; //<- remove notification
      } //<- end of notification check

      if (leftSecondary) { //<- check if menu button pressed
        if (!menu) renderMenu(); else recenterMenu(); //<- create or update menu
      } else if (menu) { //<- check if menu exists but button not pressed
        Destroy(menu); //<- remove menu
        menu = null; //<- clear menu variable
      } //<- end of menu toggle logic

      return LateUpdate.invoke(); //<- call original lateupdate
    }; //<- end of lateupdate implementation

    console.log("[777] injected."); //<- show that menu loaded successfully
  }); //<- end of il2cpp perform
}); //<- end of domcontentloaded event
