# Cadaster

Template https://github.com/umutesen/angular-material-template/


# Deploy

- ng run cadaster:build:development
- copy dist to kadaster.front
- restart kadaster.front iis app

# IIS config

- Install urlrewrite2 https://www.iis.net/downloads/microsoft/url-rewrite
- Configure
    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                    <rule name="SpaRewriteRule" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                        <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/index.html" />
                    </rule>
                    <rule name="ApiProxyRule" stopProcessing="true">
                    <match url="api/(.*)" />
                    <action type="Rewrite" url="http://localhost:8095/api/{R:1}" logRewrittenUrl="false" />
                    </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>
- Install arr https://www.iis.net/downloads/microsoft/application-request-routing
- Enable Proxy
- Restart IIS