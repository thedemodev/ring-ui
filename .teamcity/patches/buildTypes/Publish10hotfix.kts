package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, remove the buildType with id = 'Publish10hotfix'
from your code, and delete the patch script.
*/
deleteBuildType(RelativeId("Publish10hotfix"))
