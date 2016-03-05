# Architected Nork

This repository contains two versions of a simple text-based game called Nork, developed as part of a [course](http://arch-joelross.rhcloud.com/) at the UW iSchool. 

The below questions should be answered (in detail!) regarding your submission!


##### 1. Did you work with a partner? If so, who?
> I (Jimmy Nguyen) worked with Linnea Watson.
(Same!) - Linnea


##### 2. Discuss how the different architectural styles affected the implementation of your program. Was one pattern easier to use or more effective _for this problem_? Why? How do the different styles influence the ability to add new features or modify existing functionality? What kind of changes would be easier or harder with each style?
##### This discussion should be a couple of paragraphs, giving a detailed analysis of how the styles work.
> Since it encourages a batch mentality, the pipe-and-filter architecture was not the most effective for this problem because it is not appropriate for interaction. Pipe-and-filter is great to use for a program that must process streams of data, while supporting a simple composition and modularity. Since players are required to interact with Nork to get the full experience, creating filters and pipes to process input, transform input into world state changes, and transform those changes into output, complicates the process and increases the amount of computation overall. It would be easy to add in new filters to make the procedure of processing the user input more modular. For example, having a filter for each of the different commands. However, it would be difficult to process data representations other than strings if needed. 

The client-server architecture was more appropriate for this program, and standardizing the output was key towards relaying information correctly through the server's socket. However, it seemed to complicated an approach to keep returning strings, as the strings being returned to be written to the socket were constantly being incorrectly formatted, and returned as variables rather than just being able to directly print to the client at the time of processing. However, with the simple input and output that occurred, the client-server architecture fit well with being able to relay information between a client and a server preforming the operations.

I was able to effectively print out output to the client, while still logging critical server-side information that gave the developer a better feel of what was going on. It would have been easier to create a game class or object, that could track state. It would also have been easier if I could have referenced the socket within the application to directly write from it, which is an approach that I played with, but didn't end up utilizing. 

It would have been easier to reuse my old application code if I could directly socket.write from the application, but it will probably easier to change the output mechanism with this newer version of the code, because it is simply returning strings. How the user wants to relay those strings is up to them. 


##### 3. Did you add an extra features to either version of your game? If so, what?
> Jimmy: I added a help feature that displays all of the commands for the game to the user in the pipe-and-filter implementation. I also added a feature that removes consumable items from the inventory upon use. 

> Linnea: > IMPORTANT! (EXTRA CREDIT?) : As the spec suggested, I also allowed new clients to connect with their own unique game session, so that multiple clients can connect at the same time!

> I also added a feature that allows the user to remove consumable features from the inventory. I also let the users know whether or not they can't use any item in the room, or they just don't have any items. Same with removing items, if there were no items, the response was different than if there were items and you just couldn't use them. 

> I also included server-side logging of what was going on behind the scenes, so that the developer could more accurately debug and understand the data.





##### 4. Approximately how many hours did it take you to complete this assignment? #####
> Jimmy: It took me about 15 hours to implement the pipe-and-filter architecture for this game.

> Linnea: I really should start timing this, but I would guess it took about 18 hours.



##### 5. Did you receive help from any other sources (classmates, etc)? If so, please list who (be specific!). #####
> Jimmy: I worked with Kendall Reonal to dsiscuss pipe-and-filters. 

> Linnea: Only the questions to Joel asked on slack and discussions with my partner.



##### 6. Did you encounter any problems in this assignment we should warn students about in the future? How can we make the assignment better? #####
> Jimmy: Mentioning that using a pipe-and-filter architecture is not the best way to design this game in the assignment specs, like how it was mentioned in lecture, would had cleared up some confusion I had at the start.

Linnea: "consumed" makes it sound like the item has been consumed or not, I would rename that to "consumable"
