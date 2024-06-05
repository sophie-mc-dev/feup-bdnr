# Docs

The [docs](/docs/) folder contains PDF files of the milestone presentations done throughout the semester as well as the final presentation and the report writen in LaTeX. It also includes an .md file with the all the Couchbase queries used in our project.

This document contains feedback provided by our Professor on our project. The feedback provides detailed insights and suggestions that will help us refine our work and enhance the overall quality of the project.

## Content

- **Milestone 1 Presentation**: [BDNR-M1.pdf](./BDNR-M1.pdf)
- **Milestone 2 Presentation**: [BDNR-M2.pdf](./BDNR-M2.pdf)
- **Final Presentation**: [BDNR-Final_Presentation.pdf](./BDNR-Final_Presentation.pdf)
- **Project Report**: [Report.pdf](./Report.pdf)

## Detailed Feedback

The feedback was translated into English and categorized by specific topics.

- **Document Presentation**: Adequate presentation of the document at the end of the introduction, but internal references and mentions to the respective sections are missing.
- **Language Use**: In scientific-technical texts, a colloquial/informal tone should not be used. Use simple, direct, and objective language. The use of a colloquial tone is a recurring problem throughout the document.
- **Data Processing Section**: The "data processing" section identifies data querying mechanisms (query language, full-text search), not processing mechanisms.
- **Use Cases Section**: The identification of appropriate use cases adopts a tone that is too generic (promotional and mostly aligned with Couchbase materials). Concrete examples of scenarios and problems were expected.
- **Data Population**: Some detail is missing about the data population in the prototype. For example, there is no information about what it means for biographies to be random.
- **Dataset Generation**: The description of the dataset generation is very general. More details should have been provided, namely the 'prompts' used.
- **Physical Data Model**: A presentation of the physical data model is missing. What is presented under this name ("physical data model") is a diagram of the system's component architecture.
- **Design Options**: With only the presentation of JSON document examples, the presentation and discussion about design options are not clear.
- **Comments Grouping**: Comments are grouped in the context of users. How do you get comments by event? How do you know which comments are associated with a particular event? Do you have to go through all the comments? This is not a good design. The same problem exists with likes. This is an important aspect but is not discussed.
- **Access Patterns**: In the prototype, the physical model appears without a discussion of access requirements. In NoSQL paradigms, access patterns are essential to inform the design of the physical model. The planned accesses are not presented.
- **Indexing**: The importance of indexing is mentioned, but there is no detail on which indexes were specifically created.

_(This feedback should be taken into account when improving this application any time in the future.)_
