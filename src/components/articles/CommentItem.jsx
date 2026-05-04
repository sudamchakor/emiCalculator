import React, { useState } from 'react';
import { Box, Typography, Button, Avatar, Collapse } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const CommentItem = ({ comment, getReplies, onReplyClick }) => {
  // SET TO FALSE TO COLLAPSE BY DEFAULT
  const [showReplies, setShowReplies] = useState(false);

  const nestedReplies = getReplies(comment.id);

  return (
    <Box
      sx={{
        mb: 2,
        ml: comment.parentId ? { xs: 2, md: 4 } : 0,
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Avatar
          sx={{
            bgcolor: comment.parentId ? '#9e9e9e' : '#FF5722',
            width: 32,
            height: 32,
            fontSize: '0.85rem',
          }}
        >
          {comment.user?.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ bgcolor: 'rgba(0,0,0,0.03)', p: 1.5, borderRadius: 2 }}>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ fontSize: '0.85rem' }}
            >
              {comment.user}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', mt: 0.5 }}>
              {comment.text}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
            <Button
              size="small"
              startIcon={<ReplyIcon sx={{ fontSize: '1rem' }} />}
              onClick={() => onReplyClick(comment.id, comment.user)}
              sx={{
                textTransform: 'none',
                fontSize: '0.75rem',
                color: 'text.secondary',
                p: 0,
              }}
            >
              Reply
            </Button>

            {nestedReplies.length > 0 && (
              <Button
                size="small"
                startIcon={
                  showReplies ? <ExpandLessIcon /> : <ExpandMoreIcon />
                }
                onClick={() => setShowReplies(!showReplies)}
                sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0 }}
              >
                {showReplies ? 'Hide' : `Show ${nestedReplies.length} replies`}
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Nested Replies Rendering */}
      {nestedReplies.length > 0 && (
        <Collapse in={showReplies}>
          <Box
            sx={{
              mt: 1,
              borderLeft: '2px solid rgba(0,0,0,0.06)',
              ml: 2,
              pl: 1,
            }}
          >
            {nestedReplies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                getReplies={getReplies}
                onReplyClick={onReplyClick}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export default CommentItem;
