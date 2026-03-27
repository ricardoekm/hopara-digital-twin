```
#!/bin/sh
cd ./out/schemas
ls *.json | while read file
do
  newname=$(echo $file | sed 's/\.json$//g')
  cp "${file}" "${newname}"
done
```