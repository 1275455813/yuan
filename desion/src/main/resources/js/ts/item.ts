import { Tree } from "./tree";

export class Item {

   tree!: Tree;
   baseDom: HTMLElement;
   name: string;
   userData: string | undefined;
   level: number;
   isExpend: boolean = false;
   child: Item[] = [];

   constructor(level: number, name: string) {
      this.baseDom = document.createElement("div");
      this.level = level;
      this.name = name+level;

      var dom = this.baseDom;
      dom.style.cssText = "width:100%;height:30px;line-height:200%;background:red;";
      var num = (level - 1) * 20 + 5;
      dom.style.cssText += "text-indent:" + num + "px;";
      dom.innerText = this.name;
      dom.onclick = this.setOnClick.bind(this);
      this.setMouseType(dom);
   }
   public setData(data: string) {
      this.userData = data;
   }

   public addItem(name: string) {
      var le = this.level + 1;
      var subItem = new Item(le, name);
      var pdom = this.baseDom.parentElement;
      if (pdom != null) {
         this.insertAfter(subItem.baseDom, this.baseDom);
         //pdom.appendChild(subItem.baseDom);
      }
      subItem.setTree(this.tree);
      this.child.push(subItem);
      return subItem;
   }

   public setOnClick() {
      var tree = this.tree;
      tree.onClick(this);
      if(this.isExpend){
         if(tree.expendFunc){
            tree.expendFunc(this);
         }
      }
      else{
         if(tree.closeFunc){
            tree.closeFunc(this);
         }
      }
   }

   public loadJson(json:any[]){
      var len = json.length;
      for(var i = 0; i < len; i++){
         var data = json[len - i - 1];
         if(data["name"]){
            this.addItem(data["name"]);
         }else{
            continue;
         }
         if(data["isFile"]){

         }
         if(data["dir"]){
            this.userData = data["dir"];
         }
      }
   }

   public clear(){
      this.clearNode(this, this.level);
   }

   private clearNode(node:Item, level:number){
      var child = node.child;
      var len = child.length;
      console.log(node.name + ":" + len);
      if(len == 0){
         var pdom = node.baseDom.parentNode;
         if(pdom){
            pdom.removeChild(node.baseDom);
         }
      }else{
         for(var i = 0; i < len; i++){
            var c = child[i];
            this.clearNode(c, level);
         }
         node.child = [];
         if(node.level != level){
            this.clearNode(node,level);
         }
      }
   }

   private setIsFile(isFile:boolean){
      //todo
   }

   public setTree(tree: Tree) {
      this.tree = tree;
   }

   private setMouseType(dom:HTMLElement){
      dom.onmouseover = function(){
         dom.style.cursor = "pointer";
      }
      dom.onselectstart = function(){
         return false;
      }
   }

   private insertAfter(newElement:HTMLElement, targetElement:HTMLElement){
      var parent = targetElement.parentNode;
      if(parent){
         if (parent.childNodes.length == 0 || parent.lastChild == targetElement) {
            parent.appendChild(newElement);
         }else {
            parent.insertBefore(newElement, targetElement.nextSibling);
         }
      }
   }
}
