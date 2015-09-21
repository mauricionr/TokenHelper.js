#The ideia here will be 
* Create TokenHelper.js and SharePointContext.js 
* Based in these files base/TokenHelper.cs and base/SharePointContext.cs

#Setup
1> Go to /_layouts/15/AppRegNew.aspx and register a new application
2> Create a SharePoint App Provider hosted and delete the MVC project
3> Open AppManifest.xml
```
<RemoteWebApplication ClientId="{{app_client_id}}" />
<RemoteEndpoints>
  <RemoteEndpoint Url="https://localhost:3030" />
</RemoteEndpoints>
```  
4> Create File config.js and them put the client_id and appSecret
```
module.exports = {
	client_ID:"{{clientID}}",
    appSecret:'{{appSecret}}'
}
```