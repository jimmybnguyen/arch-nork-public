# Architected Nork

This repository contains two versions of a simple text-based game called Nork, developed as part of a [course](http://arch-joelross.rhcloud.com/) at the UW iSchool. 

The below questions should be answered (in detail!) regarding your submission!


##### 1. Did you work with a partner? If so, who?
> I (Jimmy Nguyen) worked with Linnea Watson.



##### 2. Discuss how the different architectural styles affected the implementation of your program. Was one pattern easier to use or more effective _for this problem_? Why? How do the different styles influence the ability to add new features or modify existing functionality? What kind of changes would be easier or harder with each style?
##### This discussion should be a couple of paragraphs, giving a detailed analysis of how the styles work.
> Since it encourages a batch mentality, the pipe-and-filter architecture was not the most effective for this problem because it is not appropriate for interaction. Pipe-and-filter is great to use for a program that must process streams of data, while supporting a simple composition and modularity. Since players are required to interact with Nork to get the full experience, creating filters and pipes to process input, transform input into world state changes, and transform those changes into output, complicates the process and increases the amount of computation overall. It would be easy to add in new filters to make the procedure of processing the user input more modular. For example, having a filter for each of the different commands. However, it would be difficult to process data representations other than strings if needed. 



##### 3. Did you add an extra features to either version of your game? If so, what?
> Linnea: I allowed the user the option to quit after submitting invalid input more than two times.

> Jimmy: I added a help feature that displays all of the commands for the game to the user in the pipe-and-filter implementation. I also added a feature that removes consumable items from the inventory upon use. 



##### 4. Approximately how many hours did it take you to complete this assignment? #####
> Jimmy: It took me about 10-13 hours to implement the pipe-and-filter architecture for this game.



##### 5. Did you receive help from any other sources (classmates, etc)? If so, please list who (be specific!). #####
> Jimmy: I worked with Kendall Reonal to dsiscuss pipe-and-filters. 



##### 6. Did you encounter any problems in this assignment we should warn students about in the future? How can we make the assignment better? #####
> Jimmy: Mentioning that using a pipe-and-filter architecture is not the best way to design this game in the assignment specs, like how it was mentioned in lecture, would had cleared up some confusion I had at the start.

