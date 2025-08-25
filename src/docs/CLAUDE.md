#ux design which we need to implement
path here: /home/henry/convo-track/public/required_UX.png

#tasks to implement
1. Contact AI On/Off Badge

"Add a clickable badge next to each contact in the sidebar that shows if AI is enabled or disabled.
If enabled → show green badge labeled 'AI'.
If disabled → show grey badge labeled 'AI Off'.
Clicking the badge toggles the AI status for that contact."

#Task_2
2. Objective - opens new tab to https://app.respond.io/space/278994/inbox/XYZ where XYZ is their contact ID (eg https://app.respond.io/space/278994/inbox/311718112) so easy to go to Respondio
Instructions:
Open in Respond.io (New Tab)
"Add a button in the chat header that opens the selected contact’s Respond.io page in a new browser tab.
Use URL format: https://app.respond.io/space/278994/inbox/{contactId}
Example: for contactId = 311718112, link should be https://app.respond.io/space/278994/inbox/311718112.
Label the button 'View on Respond.io'."

#Task_3
Objective - sent AI messages are faded, less prominent. This makes it clear they are AI messages that have already gone out.
Instructions:
Style AI messages that have already been sent with less prominence.
Use light gray background.
Prefix with 'Issa AI response'.
For UX design, reference the given photo named "required_UX.png" in this path:/home/henry/convo-track/public/required_UX.png


#Task_4
Objective - active AI responses (not sent yet, not decided yet) are bold with approve and reject buttons and knowledge base ID
Instructions:
When the AI generates a response but it hasn’t been approved yet, display it prominently:
Dark background with bold text.
Show two buttons → 'Approve and Send' (green), 'Reject' (red).
Show footer line with knowledge base ID (e.g., 'Knowledge base ID: KB_025').
For UX design, reference the given photo named "required_UX.png" in this path:/home/henry/convo-track/public/required_UX.png

#Task_5
Needs action toggle to show only the ones that require action (has a pending decision like #4) vs show all. Default to show only the ones that need action
Instructions:
Add a toggle above the contact list to switch between views:
Default = 'Needs Action' → shows only contacts that have pending AI responses (awaiting approval/rejection).
Option to switch to 'All' → shows all contacts.
This keeps the team focused on unresolved items by default."
For UX design, reference the given photo named "required_UX.png" in this path:/home/henry/convo-track/public/required_UX.png

#Task_6
Red dot for for Pending Actions #7 and #4 in the given photo - this is to show for contacts that have pending actions
Instructions:
Add a red dot indicator:
Next to any contact in the sidebar that has a pending AI response requiring approval/rejection.
On the 'Needs Action' toggle button itself if at least one pending response exists.
This ensures the team immediately sees where action is required."
For UX design, reference the given photo named "required_UX.png" in this path:/home/henry/convo-track/public/required_UX.png