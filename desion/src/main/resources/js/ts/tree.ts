import item = require("./item");
import { ajax } from "./ajax";
export class Tree {

   pdom: HTMLElement;
   expendFunc: Function | undefined;
   closeFunc:Function | undefined;

   constructor(pdom: HTMLElement) {
      this.pdom = pdom;

   }
   public createRootItem() {
      var subItem = new item.Item(0, "root");
      this.pdom.appendChild(subItem.baseDom);
      subItem.baseDom.style.display = "none";
      subItem.setTree(this);
      return subItem;
   }

   public onClick(subItem: item.Item){
      var arr = subItem.child;
      var len = arr.length;
      var isExpend = subItem.isExpend;
      for (var i = 0; i < len; i++) {
         var dom = arr[i].baseDom;
         if (isExpend) {
            dom.style.display = "none";
         } else {
            dom.style.display = "block";
         }
      }
      subItem.isExpend = !isExpend;
   }

   public ajaxGetData(){
      var a = new ajax();
      var self = this;
      a.post("http://localhost:8080/fileSystem/root",[{username:"wang",password:"123456"}],function(jd:any){
         self.setExpendFunc(function(item:item.Item){
            item.loadJson(jd);
        });
      });
   }

   public setExpendFunc(expendFunc: Function) {
      this.expendFunc = expendFunc;
   }

   public setCloseFunc(closeFunc: Function) {
      this.closeFunc = closeFunc;
   }
}