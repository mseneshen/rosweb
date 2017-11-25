import { Workspace } from "../model/workspace";
import { ROSWeb } from "../model/rosweb";
import { SerializedWorkspace } from "../model/serialized_workspace";

class Storage {

  private count: number;
  private httpRequest: XMLHttpRequest;

  constructor() {
    this.count = 0;
    let rosweb = new ROSWeb();

    if (localStorage["ROSWeb"] == undefined) {
      localStorage.setItem("ROSWeb", JSON.stringify(rosweb));
      console.log("creating rosweb localstorage");
    }

    this.httpRequest = new XMLHttpRequest();
    this.httpRequest.open( 'GET', "http://127.0.0.1:8081/workspaces" );
    this.httpRequest.setRequestHeader( "Content-Type", "application/json" );
    
    this.httpRequest.onreadystatechange = () => {
      if ( this.httpRequest.readyState == XMLHttpRequest.DONE ) {
        if ( this.httpRequest.responseText != "undefined" ) {
          console.log("Received workspaces!");
          console.log(this.httpRequest.responseText);
          if(this.httpRequest.responseText == "{}\n"){
            console.log("No workspaces exist yet on server.");
            return;
          }
          localStorage.setItem("ROSWeb", this.httpRequest.responseText);
        }
      }
    };

    this.httpRequest.send( false );

  }

  public Init(): void {
  }

  // Get
  public GetWorkspaces(): Array<SerializedWorkspace> {
    let rosweb: ROSWeb;
    try {
      rosweb = JSON.parse(localStorage.getItem("ROSWeb"));
    } catch (e) {
      alert(e);
    }
    return rosweb.Workspaces;
  }

  public GetWorkspace(workspace_id: number): SerializedWorkspace {
    let toReturn: SerializedWorkspace;
    this.GetWorkspaces().forEach((workspace: SerializedWorkspace, index: number, array: SerializedWorkspace[]) => {
      if (workspace.id == workspace_id) {
        toReturn = workspace;
      }
    });
    return toReturn;
  }

  // New
  public NewWorkspace(name: string): SerializedWorkspace {
    let id: number;
    let workspaces: Array<SerializedWorkspace> = this.GetWorkspaces();
    function sortByIdDesc(obj1: SerializedWorkspace, obj2: SerializedWorkspace) {
      if (obj1.id > obj2.id) return -1;
      if (obj1.id < obj2.id) return 1;
    }
    if (workspaces.length == 0) {
      id = 1;
    } else {
      let lastWorkspace: SerializedWorkspace = workspaces.sort(sortByIdDesc)[0];
      id = lastWorkspace.id + 1;
    }

    let workspace = new SerializedWorkspace();
    workspace.id = id;
    workspace.name = name;
    return workspace;
  }

  // Save
  public SaveWorkspace(workspace: SerializedWorkspace): void {
    let rosweb: any = JSON.parse(localStorage.getItem("ROSWeb"));
    rosweb.Workspaces.push(workspace);

    localStorage.setItem("ROSWeb", JSON.stringify(rosweb));

    this.httpRequest = new XMLHttpRequest();
    this.httpRequest.open( 'POST', "http://127.0.0.1:8081/workspaces" );
    this.httpRequest.setRequestHeader( "Content-Type", "application/json" );
    
    this.httpRequest.onreadystatechange = () => {
      if ( this.httpRequest.readyState == XMLHttpRequest.DONE ) {
        if ( this.httpRequest.responseText != "undefined" ) {
          console.log("Saved workspaces!");
          console.log(this.httpRequest.responseText);
          //localStorage.setItem("ROSWeb", JSON.parse( httpRequest.responseText ));
        }
      }
    };

    this.httpRequest.send( JSON.stringify(rosweb) );

  }

  // Load
  public LoadWorkspace(id: number): void {
    try {
      let workspaces: Array<SerializedWorkspace> = JSON.parse(localStorage["ROSWeb"]["workspaces"]);
    }
    catch (e) {
      alert(e);
    }

  }

  // Remove
  public RemoveWorkspace(id: number): SerializedWorkspace[] {
    let rosweb: ROSWeb;
    let updatedRosweb: ROSWeb = new ROSWeb();
    function filterById(workspace: SerializedWorkspace) {
      return workspace.id != id;
    }
    try {
      rosweb = JSON.parse(localStorage.getItem("ROSWeb"));
      updatedRosweb.Workspaces = new Array<SerializedWorkspace>();
      updatedRosweb.Workspaces = rosweb.Workspaces.filter(filterById);
      localStorage.setItem("ROSWeb", JSON.stringify(updatedRosweb));
      return updatedRosweb.Workspaces;
    } catch (e) {
      throw new Error(e);
    }
  }

}

export var storage: Storage = new Storage();