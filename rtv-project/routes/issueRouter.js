const express = require('express')
const issueRouter = express.Router()
const Issue = require('../models/Issue')
const Comment = require('../models/Comment')
const User = require('../models/User')

// Get all
issueRouter.get('/', (req, res, next) => {
    Issue.find((err, issues) => {
        if(err) {
            res.status(500)
            return next(err)
        }
        return res.status(200).send(issues)
    })
})

// will we need get by user or get one functions?

// Add Issue
issueRouter.post("/", (req, res, next) => {
    req.body.user = req.auth._id
    const newIssue = new Issue(req.body)
    newIssue.save((err, savedIssue) => {
      if(err){
        res.status(500)
        return next(err)
      }
      return res.status(201).send(savedIssue)
    })
})



// Delete Issue
issueRouter.delete('/:issueId', (req, res, next) => {
    Issue.findOneAndDelete(
        { _id: req.params.issueId, user: req.auth._id },
        (err, deletedIssue) => {
            if(err) {
                res.status(500)
                return next(err)
            }
            return res.status(200).send(`Successfully deleted issue: ${deletedIssue.title}`)
        }
)
})

// Update Issue
issueRouter.put("/:issueId", (req, res, next) => {
    Issue.findOneAndUpdate(
        { _id: req.params.issueId, user: req.auth._id },
        req.body,
        { new: true },
    (err, updatedIssue) => {
        if(err) {
            res.status(500)
            return next(err)
        }
        if(updatedIssue){
            return res.status(201).send(updatedIssue)
        } else {
            res.status(500)
            return next(new Error('Bad request'))
        }
    }
    )
})

// COMMENTS HANDLING

// Get all comments on an issue
issueRouter.get('/getcomments/:issueId', (req, res, next) => {
    Comment.find(
        { issue: req.params.issueId },
        (err, comments) => {
            if(err) {
                res.status(500)
                return next(err)
            }
            return res.status(200).send(comments)
        }
    )
})

// Add comment to issue ???
issueRouter.post("/addcomment/:issueId", (req, res, next) => {
    Issue.findOne(
        { _id: req.params.issueId },
        (err, issue) => {
            if(err) {
                res.status(500)
                return next(err)
            }
            if(issue) {
                req.body.user = req.auth._id
                req.body.issue = req.params.issueId
                const newComment = new Comment(req.body)
                newComment.save((err, savedComment) => {
                    if(err) {
                        res.status(500)
                        return next(err)
                    }
                    return res.status(201).send(savedComment)
                })
            } else {
                res.status(403)
                return next(new Error("That issue ID does not exist"))
            }
        }
        )
})

// Delete one comment
issueRouter.delete('/deletecomment/:commentId', (req, res, next) => {
    Comment.findOneAndDelete(
        { _id: req.params.commentId, user: req.auth._id },
        (err, deletedComment) => {
            if(err) {
                res.status(500)
                return next(err)
            }
            if(deletedComment) {
                return res.status(201).send(`Successfully deleted comment.`)
            } else {
                res.status(500)
                return next(new Error('Bad request'))
            }
        }
    )
})

// VOTE handling

// upvote post
issueRouter.put('/upvote/:issueId', (req, res, next)=>{
    Issue.findOne(
        { _id: req.params.issueId },
        (err, issue) => {
            if(err){
                res.status(500)
                return next(err)
            }
            console.log(issue.likedBy)
            // console.log(req.auth._id.toString())
            const userIdMatch = (element) => element == req.auth._id
            console.log(issue.likedBy.findIndex(userIdMatch))
            if (issue.likedBy.findIndex(userIdMatch) > -1) {
                Issue.updateOne(
                    { _id: req.params.issueId },
                    { $pull: {likedBy: req.auth._id}},
                    { new: true },
                    (err, updatedLike) => {
                        if(err) {
                            res.status(500)
                            return next(err)
                        }
                        return res.status(201).send('Upvote removed')
                    }
                )
            } else {
                Issue.updateOne(
                    { _id: req.params.issueId },
                    { $addToSet: {likedBy: req.auth._id}},
                    { new: true },
                    (err, upvotedIssue) => {
                        if(err) {
                            res.status(500)
                            return next(err)
                        }
                    }
                )
                User.updateOne(
                    { _id: req.auth._id },
                    { $addToSet: {likedPosts: req.params.issueId}},
                    { new: true },
                    (err, updatedUser) => {
                        if(err){
                            res.status(500)
                            return next(err)
                        }
                        return res.status(201).send('Successful upvote')
                    }
                )
            }
        }
    )
})

// downvote post
issueRouter.put('/downvote/:issueId', (req, res, next) => {
    Issue.findOne(
        { _id: req.params.issueId },
        (err, issue) => {
            if(err){
                res.status(500)
                return next(err)
            }
            const userIdMatch = (element) => element == req.auth._id
            if (issue.dislikedBy.findIndex(userIdMatch) > -1) {
                Issue.updateOne(
                    { _id: req.params.issueId },
                    { $pull: {dislikedBy: req.auth._id}},
                    { new: true },
                    (err, updatedDislike) => {
                        if(err) {
                            res.status(500)
                            return next(err)
                        }
                        return res.status(201).send('Downvote removed')
                    }
                )
            } else {
                Issue.updateOne(
                    { _id: req.params.issueId },
                    { $addToSet: {dislikedBy: req.auth._id}},
                    { new: true },
                    (err, upvotedIssue) => {
                        if(err) {
                            res.status(500)
                            return next(err)
                        }
                    }
                )
                User.updateOne(
                    { _id: req.auth._id },
                    { $addToSet: {dislikedPosts: req.params.issueId}},
                    { new: true },
                    (err, updatedUser) => {
                        if(err){
                            res.status(500)
                            return next(err)
                        }
                        return res.status(201).send('Successful downvote')
                    }
                )
            }
        }
    )
})


module.exports = issueRouter