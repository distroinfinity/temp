import { Storage } from "aws-amplify";

export async function s3Upload(file) {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type,
  });

  return stored.key;
}

export async function s3ProfilePhotoUpload(file,filename){

  const stored = await Storage.vault.put(filename, file,  {
    contentType: file.type,
    level:"public"
  }, );

  const url =await Storage.vault.get(stored.key).then((res)=>{
    console.log(res)
  })
  
  return url;

}