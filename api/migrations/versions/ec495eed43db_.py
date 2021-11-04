"""empty message

Revision ID: ec495eed43db
Revises: f44c0651e19b
Create Date: 2021-10-31 15:57:14.878146

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ec495eed43db'
down_revision = 'f44c0651e19b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('UserInfo', sa.Column('deactivate', sa.Boolean(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('UserInfo', 'deactivate')
    # ### end Alembic commands ###
