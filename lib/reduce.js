'use strict';

var _ = require('lodash');
var bundle = require('./bundle');

/**
 * Given a set of bundles, merge until no main module needs to fetch from more
 * than maxBundles number of bundles.
 */
function reduceBundles(bundles, dependencies, maxBundles) {
    while (anyMainExceedsMaxBundles(bundles, maxBundles)) {
        var merge = findLeastCostMerge(bundles, dependencies, maxBundles);
        mergeBundles(merge.bundle1Name, merge.bundle2Name, bundles);
    }
    return bundles;
}

function groupBundlesByMain(bundles) {
    var bundlesByMain = {};
    _.forIn(bundles, function(bundle, bundleName) {
        _.forIn(bundle.dependentMains, function(mainName) {
            if (!bundlesByMain[mainName]) {
                bundlesByMain[mainName] = [];
            }
            bundlesByMain[mainName].push(bundleName);
        });
    });
    return bundlesByMain;
}

function anyMainExceedsMaxBundles(bundles, maxBundles) {
    return _.any(groupBundlesByMain(bundles), function(bundles, main) {
        return bundles.length > maxBundles;
    });
}

function mergeBundles(bundle1Name, bundle2Name, bundles) {

    var bundle1 = bundles[bundle1Name];
    var bundle2 = bundles[bundle2Name];
    var newBundle = {
        dependentMains: _.union(
            bundle1.dependentMains, bundle2.dependentMains
        ),
        dependencies: _.union(
            bundle1.dependencies, bundle2.dependencies
        )
    };
    var newBundleName = bundle.generateBundleName(newBundle.dependentMains);
    newBundle.name = newBundleName;
    // Does a bundle with same name/dependencies already exist?
    if (bundles[newBundleName]) {
        newBundle.dependentMains = _.union(
            newBundle.dependentMains,
            bundles[newBundleName].dependentMains
        );
        newBundle.dependencies = _.union(
            newBundle.dependencies,
            bundles[newBundleName].dependencies
        );
    }
    delete(bundles[bundle1Name]);
    delete(bundles[bundle2Name]);
    bundles[newBundleName] = newBundle;
}

function findLeastCostMerge(bundles, dependencies, maxBundles) {
    // Which bundle, when merged into other bundles, has least cost?
    // Least cost == the least amount of extra download on all mains.
    var bundlesByMain = groupBundlesByMain(bundles);
    var bestMerge = {
        bundle1Name: null,
        bundle2Name: null,
        cost: Infinity
    };
    _.forIn(bundlesByMain, function(bundleNames, mainName) {
        // Does the current main need more bundles than maxBundles? If so,
        // we will try to merge two of them.
        if (bundleNames.length > maxBundles) {
            // Try all combinations of pairs of bundles for this main.
            _.forEach(bundleNames, function(bundle1Name, index) {
                _.forEach(_.rest(bundleNames, index + 1), function(bundle2Name) {
                    var bundle1 = bundles[bundle1Name];
                    var bundle2 = bundles[bundle2Name];
                    var merge = {
                        bundle1Name: bundle1Name,
                        bundle2Name: bundle2Name,
                        cost: 0
                    };
                    // The cost of merging these two bundles is that:
                    // 1. mains that only need bundle1 will have extra cost of
                    //    bundle2 contents.
                    // 2. mains that only need bundle2 will have extra cost of
                    //    bundle1 contents.
                    var bundle1Cost = 0;
                    _.forEach(bundle1.dependencies, function(dependencyId) {
                        bundle1Cost += dependencies[dependencyId].size;
                    });
                    var bundle2Cost = 0;
                    _.forEach(bundle2.dependencies, function(dependencyId) {
                        bundle2Cost += dependencies[dependencyId].size;
                    });
                    var bundle1OnlyMains = _.difference(
                        bundle1.dependentMains, bundle2.dependentMains
                    );
                    var bundle2OnlyMains = _.difference(
                        bundle2.dependentMains, bundle1.dependentMains
                    );
                    merge.cost = (
                        bundle1Cost * bundle2OnlyMains.length +
                        bundle2Cost * bundle1OnlyMains.length
                    );
                    if (merge.cost < bestMerge.cost) {
                        bestMerge = merge;
                    }
                });
            });
        }
    });
    return bestMerge;
}

module.exports = {
    reduceBundles: reduceBundles

};
