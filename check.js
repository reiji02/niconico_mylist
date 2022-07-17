const sqlite3 = require("sqlite3")
const fs = require("fs")
const db = new sqlite3.Database("./niconico_mylist.db")
const data = require("./input.json")
const { argv } = require("process")

const sleep = (second) => new Promise(resolve => setTimeout(resolve, second * 1000))

const result = {}

list = data.list
ids = []
obj_ids = []

if (process.argv.length == 2) {
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS mylists( \
            id string primary key, \
            title string, \
            url string \
        )", (err) => {
            if (err) {
                console.log(err)
            }
        })
    
        db.all("SELECT * FROM mylists", (err, rows) => {
            if (err) {
                console.log(err)
            }
            else {
                rows.forEach((row) => {ids.push(row.id)})
                list.forEach((obj) => {
                    obj.id = obj.url.split(/watch\//)[1]
                    obj_ids.push(obj.id);
                })
                
                samevalues = existsSameValue(obj_ids)
                console.log("existsSameValue: count:"+samevalues.length)
                console.log(samevalues)

                skip_data_list = []
                done_input_same_values_list = []
                list.forEach((obj) => {
                    if(!ids.includes(obj.id)) {
                        db.run("insert into mylists(id, title, url) values(?,?,?)", obj.id, obj.title, obj.url, err => {if (err) {console.log(err)}} );
                        ids.push(obj.id)
                    }else{
                        skip_data_list.push(obj.id)
                    }
                });
                console.log(`skip_data: (count:${skip_data_list.length})`)
    
                db.all("SELECT count(*) FROM mylists", (err, rows) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log(rows)
                    }
                })
            }
        })
    });
} else if (process.argv.length == 3) {
    search_text = process.argv[2]
    sql = "SELECT * FROM mylists WHERE title LIKE '%"+search_text+"%' OR id = '"+search_text+"'"
    console.log(sql)
    db.serialize(() => {
        db.all(sql, (err, rows) => {
            if (err) {
                console.log(err)
            }
            else {
                results = []
                rows.forEach((row) => {results.push({"id": row.id, title: row.title, url: row.url})})
                console.log(results)
            }
        })
    });
}

function existsSameValue(arr){
    var existsSame = false;
    var samedatas = []

    arr.forEach(function(val){
      var firstIndex = arr.indexOf(val);
      var lastIndex = arr.lastIndexOf(val);
   
      if(firstIndex !== lastIndex){
        existsSame = arr[firstIndex];
        if(samedatas.indexOf(existsSame) == -1){
            samedatas.push(existsSame)
        }
      }
    })

    return samedatas;
  }