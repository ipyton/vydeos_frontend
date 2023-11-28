//an avatar: 30 kB
//a miniture of picture/video is 100kB 

import { Tungsten } from "@mui/icons-material";

export class LRUPicCacheUtil {
    total_length = 10
    idx=[]
    list = null;
    pointer = -1


    constructor () {
        this.list = this.deserialize()
    }

    serialize() {
        localStorage.setItem("pic_index", JSON.stringify(list))
    }

    deserialize() {
        result = localStorage.getItem("pic_index")
        if (null === result) return new LinkedListNode()
        else {
            result = JSON.parse(result)
        }
        return result
    }

    evict() {
        localStorage.removeItem(this.list.get)
        this.list.removeLast()
    }

    get(key) {
        let item = JSON.parse(localStorage.getItem(key))
        if(null === item) {
            return null
        }
        else {
            this.list.removeAt(item[0])
            this.list.insertFirst(item[0])

        }
        return item[1];

    }

    set(key, value){
        if (null !== localStorage.getItem(key)) {
            return 
        }
        while (localStorage.length >= this.total_length) {
            this.evict()
        }
        localStorage.setItem(key, JSON.stringify([index, value]))
        this.list.insertFirst(key)

    }


}