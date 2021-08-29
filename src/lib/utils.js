/**
   * @param {string} item name of a key in localStorage
   * @param {number} value the value in which to set the item
   * @return void
   * @description at this time i am only concerned with setting numbers to local storage
   */
export const updateLocalStorage = (item, value) => {
    localStorage.setItem(item, value);
  };


   /**
    * @param {Writable<number>} time timeOn or timeOff store
    *  @return void
    * */ 
export const incrementTime = (time) => {
   time.update(time => time + 1);
 };