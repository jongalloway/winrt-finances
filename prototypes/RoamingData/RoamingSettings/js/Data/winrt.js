﻿(function () {
    "use strict";

    var roamingInstance;
    var localInstance;

    var WinRTDataSource = WinJS.Class.define(function (folder, ioHelper) {
        if (!folder) throw new Error("Parameter 'folder' is required");
        if (!ioHelper) throw new Error("Parameter 'ioHelper' is required");

        this.storageFolder = folder;
        this.io = ioHelper;
    }, {
        loadObject: function (fileName, def) {
            return this.io.readText(fileName, '{}')
                .then(function (json) {
                    return JSON.parse(json);
                });
        },
        saveObject: function (fileName, obj) {
            var json = JSON.stringify(obj);
            return this.io.writeText(fileName, json);
        },
        listObjects: function () {
            return this.storageFolder.getFilesAsync().then(function (fileList) {
                var results = [];
                for (var i = 0; i < fileList.size; i++) {
                    results.push(fileList[i].name);
                }
                return results;
            });
        }
    });

    WinJS.Namespace.define("Finances.Data", {
        roaming: {
            get: function () {
                if (!roamingInstance) {
                    roamingInstance = new WinRTDataSource(Windows.Storage.ApplicationData.current.roamingFolder, WinJS.Application.roaming);
                }
                return roamingInstance;
            }
        },
        local: {
            get: function () {
                if (!localInstance) {
                    localInstance = new WinRTDataSource(Windows.Storage.ApplicationData.current.localFolder, WinJS.Application.local);
                }
                return localInstance;
            }
        }
    });
})();