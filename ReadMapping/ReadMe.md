InfSeqScroll
============

Description
-----------
This code was used for a web project which allows for browsing of the maize genome.
Its main use it to convey a sense of scale by allowing "infinite" scrolling of the genome.
Statisitcs about how much of the genome is loaded at the top of the screen and as you scroll
along, they are updated in real time. The graphics for the chromosomes also change with time
and as you scroll along, the arrow showing you your position in the genome changes.

Problems
--------
Since the genome is too large to be served at once in the browser, I had to use MySQL to store
frames of it which are served out, meaning there is some setting up of the actual server-side 
code. Email me if you actually want to do this and I'll help set it up. 
