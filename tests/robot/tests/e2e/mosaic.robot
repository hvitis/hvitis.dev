*** Settings ***
Library     SeleniumLibrary

*** Variables ***
${BROWSER}    Chrome
${URL}        https://hvitis.dev/mosaic-art-maker

*** Keywords ***
Open Mosaic Page
    Open Browser   ${URL}     ${BROWSER}
    Wait Until Element Is Visible    id:board-size

*** Test Cases ***

Page opens correctly
    Open Mosaic Page

Input changer induces slider change
    Open Mosaic Page
    Input Text                        id:board-size            15
    Element Text Should Be            id:board-size-text       width 10 x height 105

Notification can be closed
    Element Text Should Be            id:notification-title    New version has arrived!
    Click Button                      id:notification-close
    Element Should Not Be Visible     id:notification-title
