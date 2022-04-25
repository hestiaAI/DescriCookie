var resultingData;

function getDatabase() {
  var retour;
  Papa.parse("https://raw.githubusercontent.com/jkwakman/Open-Cookie-Database/master/open-cookie-database.csv", {
    header: true,
    download: true,
    before: function(file, inputElem)
    {
      console.log("Parsing file...", file);
    },
      error: function(err, file)
    {
      console.log("ERROR:", err, file);
    },
    complete: function(results)
    {
      retour = results["data"];
      showCookiesForTab(retour);
    }
  });
}

async function showCookiesForTab(retour) {
  let tabs = await getActiveTab();
  let tab = tabs.pop();

  var gettingAllCookies = browser.cookies.getAll({url: tab.url});
  gettingAllCookies.then((cookies) => {
    var cookieList = document.getElementById('cookie-list');

    if (cookies.length > 0) {
      var found = 0;
      var counter = 0;
      for (let cookie of cookies) {
        copie = [];
        retour.forEach(function(item) {
          if (item["Cookie / Data Key name"] == cookie.name) {
            copie.push(item);
          }
        });

        if (copie.length == 1) {
          found += 1;

          let li = document.createElement("li");
          let content = document.createTextNode(cookie.name + ": ");

          let infos = document.createElement("ul");

          let platform = document.createElement("li");
          let platform_infos = document.createTextNode("Platform: " + copie[0]["Platform"]);
          platform.appendChild(platform_infos);
          infos.appendChild(platform);

          let category = document.createElement("li");
          let category_infos = document.createTextNode("Category: " + copie[0]["Category"]);
          category.appendChild(category_infos);
          infos.appendChild(category);

          let description = document.createElement("li");
          let description_infos = document.createTextNode("Description: " + copie[0]["Description"]);
          description.appendChild(description_infos);
          infos.appendChild(description);

          let period = document.createElement("li");
          let period_infos = document.createTextNode("Retention period: " + copie[0]["Retention period"]);
          period.appendChild(period_infos);
          infos.appendChild(period);

          li.appendChild(content);
          li.appendChild(infos);
          cookieList.appendChild(li);
        } else {
          counter += 1;
        }
      }
      if (counter > 0) {
        let li = document.createElement("li");
        var content;
        if (found > 0) {
          content = document.createTextNode("... And " + counter + " more cookies with no infos found.");
        } else {
          content = document.createTextNode(counter + " cookies with no infos found.");
        }
        li.appendChild(content);
        cookieList.appendChild(li);
      }
    } else {
      let li = document.createElement("li");
      let content = document.createTextNode("No cookies found in this tab.");
      li.appendChild(content);
      cookieList.appendChild(li);
    }

    var activeTabUrl = document.getElementById('header-title');
    var text = document.createTextNode("Found " + (found + counter) + " cookies on " + tab.title);
    activeTabUrl.appendChild(text);
  });
}

function getActiveTab() {
  return browser.tabs.query({currentWindow: true, active: true});
}

getDatabase();
